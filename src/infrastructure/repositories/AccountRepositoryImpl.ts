import { Repository } from "typeorm";
import { AccountRepository } from "@domain/repositories/AccountRepository";
import { Account } from "@domain/entities/Account";
import { Money } from "@domain/value-objects/Money";
import { AccountEntity } from "../entities/AccountEntity";
import { EventBus } from "../events/EventBus";

export class AccountRepositoryImpl implements AccountRepository {
  constructor(private ormRepo: Repository<AccountEntity>, private eventBus: EventBus) {}

  async findById(id: string): Promise<Account | null> {
    const entity = await this.ormRepo.findOneBy({ id });
    if (!entity) return null;
    return new Account(entity.id, new Money(Number(entity.balance_amount), entity.balance_currency));
  }

  async save(account: Account): Promise<void> {
    const entity = new AccountEntity();
    entity.id = account.id;
    entity.balance_amount = account.balance.amount;
    entity.balance_currency = account.balance.currency;

    await this.ormRepo.save(entity);

    const events = account.pullDomainEvents();
    for (const ev of events) {
      await this.eventBus.publish(ev);
    }
  }
}
