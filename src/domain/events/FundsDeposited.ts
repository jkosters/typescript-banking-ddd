import { DomainEvent } from "./DomainEvent";

export class FundsDeposited implements DomainEvent {
  occurredOn: Date;
  constructor(
    public readonly accountId: string,
    public readonly amount: number,
    public readonly currency: string
  ) {
    this.occurredOn = new Date();
  }
}
