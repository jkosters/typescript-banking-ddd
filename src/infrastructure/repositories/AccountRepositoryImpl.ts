import { Repository } from "typeorm";
import { AccountRepository } from "@domain/repositories/AccountRepository";
import { Account } from "@domain/entities/Account";
import { Money } from "@domain/value-objects/Money";
import { AccountEntity } from "../entities/AccountEntity";
import { EventBus } from "../events/EventBus";
import { TransactionEntity } from "../entities/TransactionEntity";
import { Transaction as DomainTransaction } from "@domain/entities/Transaction";

export class AccountRepositoryImpl implements AccountRepository {
  constructor(private ormRepo: Repository<AccountEntity>, private eventBus: EventBus, private txRepo?: Repository<TransactionEntity>) {}

  async findById(id: string): Promise<Account | null> {
    const entity = await this.ormRepo.findOneBy({ id });
    if (!entity) return null;

    // load transactions if txRepo provided
    let transactions = undefined;
    if (this.txRepo) {
      const rows = await this.txRepo.findBy({ account_id: id });
      transactions = rows.map(r => new DomainTransaction(r.id, r.account_id, r.type as any, new Money(Number(r.amount), r.currency), r.occurred_on));
    }

    return new Account(entity.id, new Money(Number(entity.balance_amount), entity.balance_currency), transactions);
  }

  async save(account: Account): Promise<void> {
    // Persist account and transactions in a single transaction using the repository manager
    const manager = this.ormRepo.manager;
    await manager.transaction(async (m) => {
      const accRepo = m.getRepository(AccountEntity);
      const accEntity = new AccountEntity();
      accEntity.id = account.id;
      accEntity.balance_amount = account.balance.amount;
      accEntity.balance_currency = account.balance.currency;
      await accRepo.save(accEntity);

      if (this.txRepo) {
        const txRepository = m.getRepository(TransactionEntity);
        // naive approach: insert all transactions (in a real app you'd diff and upsert)
        const txs = account.getTransactions();
        for (const t of txs) {
          const te = new TransactionEntity();
          te.id = t.id;
          te.account_id = t.accountId;
          te.type = t.type;
          te.amount = t.amount.amount;
          te.currency = t.amount.currency;
          te.occurred_on = t.occurredOn;
          await txRepository.save(te);
        }
      }
    });

    const events = account.pullDomainEvents();
    for (const ev of events) {
      await this.eventBus.publish(ev);
    }
  }
}
