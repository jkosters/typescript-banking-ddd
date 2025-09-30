import { AccountService } from '@application/AccountService';

export class TransactionService {
  constructor(private accountService: AccountService) {}

  async createTransaction(accountId: string, type: string, amount: number, currency: string): Promise<string> {
    if (type === 'deposit') {
      await this.accountService.deposit(accountId, amount, currency);
      return 'deposit';
    }

    if (type === 'withdraw') {
      await this.accountService.withdraw(accountId, amount, currency);
      return 'withdraw';
    }

    throw new Error('Unsupported transaction type');
  }

  async findByAccount(accountId: string) {
    // delegate to repo via account service if a method exists; keep simple for now
    const account = await (this.accountService as any).getAccountEntity?.(accountId);
    if (!account) return [];
    return account.getTransactions ? account.getTransactions() : [];
  }
}
