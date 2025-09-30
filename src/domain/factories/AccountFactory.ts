import { Account } from "../entities/Account";
import { Money } from "../value-objects/Money";
import { v4 as uuidv4 } from "uuid";
import { AccountOpened } from "../events/AccountOpened";

export class AccountFactory {
  createAccount(initialDeposit: Money): Account {
    if (initialDeposit.amount < 0) throw new Error("Initial deposit must be >= 0");
    const id = uuidv4();
    const account = new Account(id, initialDeposit);
    account['addDomainEvent'](new AccountOpened(id, initialDeposit.amount, initialDeposit.currency));
    return account;
  }
}
