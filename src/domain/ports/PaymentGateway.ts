export interface ChargeCommand {
  requestId: string; // idempotency key
  accountId: string;
  amount: number;
  currency: string;
}

export interface ChargeResult {
  success: boolean;
  providerReference?: string;
  settledAt?: Date;
  errorCode?: string;
}

export interface PaymentGateway {
  charge(cmd: ChargeCommand): Promise<ChargeResult>;
}
