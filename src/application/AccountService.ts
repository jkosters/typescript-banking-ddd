import { AccountRepository } from "@domain/repositories/AccountRepository";
import { AccountFactory } from "@domain/factories/AccountFactory";
import { Money } from "@domain/value-objects/Money";
import { MinimumBalanceSpecification, AccountActiveSpecification } from "@domain/specifications/CanWithdrawSpecification";

export class AccountService {
  constructor(private repo: AccountRepository, private factory: AccountFactory) {}

  async openAccount(initialAmount: number, currency: string): Promise<string> {
    const account = this.factory.createAccount(new Money(initialAmount, currency));
    await this.repo.save(account);
    return account.id;
  }

  async deposit(accountId: string, amount: number, currency: string): Promise<string> {
    const account = await this.repo.findById(accountId);
    if (!account) throw new Error("Account not found");
    const txId = account.deposit(new Money(amount, currency));
    await this.repo.save(account);
    return txId;
  }

  async withdraw(accountId: string, amount: number, currency: string): Promise<string> {
    const account = await this.repo.findById(accountId);
    if (!account) throw new Error("Account not found");

    const spec = new MinimumBalanceSpecification(amount).and(new AccountActiveSpecification());
    if (!spec.isSatisfiedBy(account)) throw new Error("Withdrawal conditions not met");

  const txId = account.withdraw(new Money(amount, currency));
  await this.repo.save(account);
  return txId;
  }

  // read model helper for HTTP controllers
  async getAccount(accountId: string): Promise<{ id: string; balance: { amount: number; currency: string }; active: boolean } | null> {
    const account = await this.repo.findById(accountId);
    if (!account) return null;
    return { id: account.id, balance: { amount: account.balance.amount, currency: account.balance.currency }, active: account.isActive() };
  }
}
