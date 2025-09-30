import { Specification } from "./Specification";
import { Account } from "../entities/Account";

export class MinimumBalanceSpecification extends Specification<Account> {
  constructor(private minimumBalance: number) { super(); }
  isSatisfiedBy(account: Account): boolean {
    return account.balance.amount >= this.minimumBalance;
  }
}

export class AccountActiveSpecification extends Specification<Account> {
  isSatisfiedBy(account: Account): boolean {
    return account.isActive();
  }
}
