import { DomainEvent } from './DomainEvent';

export class CustomerCreated implements DomainEvent {
  occurredOn: Date;
  constructor(
    public readonly customerId: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string
  ) {
    this.occurredOn = new Date();
  }
}
