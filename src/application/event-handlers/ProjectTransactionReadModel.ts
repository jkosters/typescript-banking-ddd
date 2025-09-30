import { TransactionReadRepository } from '@infrastructure/repositories/read/TransactionReadRepository';
import { TransactionReadEntity } from '@infrastructure/read-models/TransactionReadEntity';
import { TransactionCreated } from '@domain/events/TransactionCreated';

export class ProjectTransactionReadModel {
  constructor(private repo: TransactionReadRepository) {}

  async handle(event: any) {
    if (!(event instanceof TransactionCreated)) return;
    const e = new TransactionReadEntity();
    e.id = event.transactionId;
    e.account_id = event.accountId;
    e.type = event.type;
    e.amount = event.amount;
    e.currency = event.currency;
    e.occurred_on = new Date();
    await this.repo.upsert(e);
  }
}
