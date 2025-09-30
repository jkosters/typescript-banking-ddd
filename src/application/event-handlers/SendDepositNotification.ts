import { FundsDeposited } from "@domain/events/FundsDeposited";

export class SendDepositNotification {
  async handle(event: FundsDeposited) {
    console.log(`[NOTIFY] Account ${event.accountId} credited with ${event.amount} ${event.currency}`);
  }
}
