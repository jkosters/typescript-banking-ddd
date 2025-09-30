import { PaymentGateway, ChargeCommand, ChargeResult } from '@domain/ports/PaymentGateway';

export class PaymentService {
  constructor(private gateway: PaymentGateway) {}

  async charge(requestId: string, accountId: string, amount: number, currency: string): Promise<ChargeResult> {
    const cmd: ChargeCommand = { requestId, accountId, amount, currency };
    return this.gateway.charge(cmd);
  }
}
