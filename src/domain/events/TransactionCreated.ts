import { DomainEvent } from './DomainEvent';

export class TransactionCreated implements DomainEvent {
  occurredOn: Date;
  constructor(
    public readonly transactionId: string,
    public readonly accountId: string,
    public readonly type: string,
    public readonly amount: number,
    public readonly currency: string
  ) {
    this.occurredOn = new Date();
  }
}
