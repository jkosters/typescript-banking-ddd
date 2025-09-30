import axios from 'axios';
import { PaymentGateway, ChargeCommand, ChargeResult } from '@domain/ports/PaymentGateway';
import { PaymentTranslator } from './PaymentTranslator';

export class PaymentGatewayAdapter implements PaymentGateway {
  constructor(private baseUrl: string, private apiKey?: string) {}

  async charge(cmd: ChargeCommand): Promise<ChargeResult> {
    const payload = PaymentTranslator.toExternal(cmd);
    try {
      const resp = await axios.post(`${this.baseUrl}/charges`, payload, { headers: { Authorization: `Bearer ${this.apiKey}` } });
      return PaymentTranslator.fromExternal(resp.data);
    } catch (err: any) {
      return { success: false, errorCode: err?.response?.status?.toString() || err?.code || 'network_error' };
    }
  }
}
