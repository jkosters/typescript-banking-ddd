import { AccountReadRepository } from '@infrastructure/repositories/read/AccountReadRepository';
import { AccountReadEntity } from '@infrastructure/read-models/AccountReadEntity';
import { AccountOpened } from '@domain/events/AccountOpened';
import { FundsDeposited } from '@domain/events/FundsDeposited';
import { FundsWithdrawn } from '@domain/events/FundsWithdrawn';

export class ProjectAccountReadModel {
  constructor(private repo: AccountReadRepository) {}

  async handle(event: any) {
    if (event instanceof AccountOpened) {
      const e = new AccountReadEntity();
      e.id = event.accountId;
      e.balance_amount = event.initialAmount;
      e.balance_currency = event.currency;
      e.is_active = true;
      await this.repo.upsert(e);
    }

    if (event instanceof FundsDeposited) {
      const existing = await this.repo.findById(event.accountId);
      if (!existing) return; // eventual consistency: skip if missing
      existing.balance_amount = Number(existing.balance_amount) + Number(event.amount);
      await this.repo.upsert(existing);
    }

    if (event instanceof FundsWithdrawn) {
      const existing = await this.repo.findById(event.accountId);
      if (!existing) return;
      existing.balance_amount = Number(existing.balance_amount) - Number(event.amount);
      await this.repo.upsert(existing);
    }
  }
}
