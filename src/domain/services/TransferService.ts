import { AccountRepository } from '@domain/repositories/AccountRepository';
import { Money } from '@domain/value-objects/Money';
import { MinimumBalanceSpecification, AccountActiveSpecification } from '@domain/specifications/CanWithdrawSpecification';

export class TransferService {
  constructor(private repo: AccountRepository) {}

  async transfer(requestId: string, fromAccountId: string, toAccountId: string, amount: number, currency: string) {
    if (fromAccountId === toAccountId) throw new Error('Cannot transfer to the same account');

    const from = await this.repo.findById(fromAccountId);
    const to = await this.repo.findById(toAccountId);
    if (!from) throw new Error('Source account not found');
    if (!to) throw new Error('Destination account not found');

    if (from.balance.currency !== currency) throw new Error('Source account currency mismatch');
    if (to.balance.currency !== currency) throw new Error('Destination account currency mismatch');

    const spec = new MinimumBalanceSpecification(amount).and(new AccountActiveSpecification());
    if (!spec.isSatisfiedBy(from)) throw new Error('Insufficient funds or account inactive');

    const fromTxId = from.withdraw(new Money(amount, currency));
    const toTxId = to.deposit(new Money(amount, currency));

    // If repository supports saveAll, persist both in a single transaction; otherwise persist sequentially
    if (typeof (this.repo as any).saveAll === 'function') {
      await (this.repo as any).saveAll([from, to]);
    } else {
      await this.repo.save(from);
      await this.repo.save(to);
    }

    return { fromTransactionId: fromTxId, toTransactionId: toTxId };
  }
}
