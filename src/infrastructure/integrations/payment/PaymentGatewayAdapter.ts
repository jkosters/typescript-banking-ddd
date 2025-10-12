import axios, { AxiosError } from 'axios';
import { PaymentGateway, ChargeCommand, ChargeResult } from '@domain/ports/PaymentGateway';
import { PaymentTranslator } from './PaymentTranslator';

type CBState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export class PaymentGatewayAdapter implements PaymentGateway {
  private failureCount = 0;
  private successCount = 0;
  private state: CBState = 'CLOSED';
  private lastFailureAt: number | null = null;

  // config
  private failureThreshold = 5; // failures to open circuit
  private cooldownMs = 30_000; // open circuit duration
  private halfOpenMaxSuccess = 5; // resets
  private retryAttempts = 3;
  private retryBaseDelayMs = 200;

  constructor(private baseUrl: string, private apiKey?: string) {}

  private isOpen(): boolean {
    if (this.state === 'OPEN') {
      if (!this.lastFailureAt) return true;
      const now = Date.now();
      if (now - this.lastFailureAt > this.cooldownMs) {
        // move to half-open to test
        this.state = 'HALF_OPEN';
        this.failureCount = 0;
        this.successCount = 0;
        return false;
      }
      return true;
    }
    return false;
  }

  private recordSuccess() {
    this.successCount += 1;
    if (this.state === 'HALF_OPEN' && this.successCount >= this.halfOpenMaxSuccess) {
      // close circuit
      this.state = 'CLOSED';
      this.failureCount = 0;
      this.successCount = 0;
    }
  }

  private recordFailure() {
    this.failureCount += 1;
    this.lastFailureAt = Date.now();
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }

  private async sleep(ms: number) {
    return new Promise<void>(r => setTimeout(r, ms));
  }

  private async doPost(payload: any) {
    return axios.post(`${this.baseUrl}/charges`, payload, { headers: { Authorization: `Bearer ${this.apiKey}` } });
  }

  async charge(cmd: ChargeCommand): Promise<ChargeResult> {
    if (this.isOpen()) {
      return { success: false, errorCode: 'circuit_open' };
    }

    const payload = PaymentTranslator.toExternal(cmd);

    let attempt = 0;
    let lastError: any = null;

    while (attempt < this.retryAttempts) {
      attempt += 1;
      try {
        const resp = await this.doPost(payload);
        // success
        this.recordSuccess();
        return PaymentTranslator.fromExternal(resp.data);
      } catch (err) {
        lastError = err as AxiosError;
        this.recordFailure();

        // if half-open, fail fast on first error and open circuit
        if (this.state === 'HALF_OPEN') break;

        // exponential backoff
        const delay = this.retryBaseDelayMs * Math.pow(2, attempt - 1);
        await this.sleep(delay);
      }
    }

    // all retries failed
    const code = (lastError as AxiosError | null)?.response?.status?.toString() || (lastError as any)?.code || 'network_error';
    return { success: false, errorCode: code };
  }
}
