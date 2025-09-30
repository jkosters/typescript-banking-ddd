import { DomainEvent } from "./DomainEvent";

export class AccountOpened implements DomainEvent {
  occurredOn: Date;
  constructor(
    public readonly accountId: string,
    public readonly initialAmount: number,
    public readonly currency: string
  ) {
    this.occurredOn = new Date();
  }
}
