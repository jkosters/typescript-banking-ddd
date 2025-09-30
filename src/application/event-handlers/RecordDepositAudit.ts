import { DomainEvent } from "@domain/events/DomainEvent";

export class RecordDepositAudit {
  async handle(event: DomainEvent) {
    console.log(`[AUDIT] ${event.constructor.name} - ${JSON.stringify(event)}`);
  }
}
