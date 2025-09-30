import { ChargeCommand, ChargeResult } from '@domain/ports/PaymentGateway';

export const PaymentTranslator = {
  toExternal(cmd: ChargeCommand) {
    return {
      idempotency_key: cmd.requestId,
      account: cmd.accountId,
      amount: cmd.amount,
      currency: cmd.currency,
    };
  },

  fromExternal(resp: any): ChargeResult {
    if (!resp) return { success: false, errorCode: 'no-response' };
    return { success: resp.success === true, providerReference: resp.id, settledAt: resp.settled_at ? new Date(resp.settled_at) : undefined };
  }
};
