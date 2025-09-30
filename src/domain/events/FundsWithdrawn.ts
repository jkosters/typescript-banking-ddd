import { DomainEvent } from "./DomainEvent";

export class FundsWithdrawn implements DomainEvent {
  occurredOn: Date;
  constructor(
    public readonly accountId: string,
    public readonly amount: number,
    public readonly currency: string
  ) {
    this.occurredOn = new Date();
  }
}
