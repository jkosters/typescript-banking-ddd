// TransactionRepository is deprecated. Transactions are part of the Account aggregate and
// must be created/modified via the AccountRepository (aggregate root) to preserve invariants.
// The Transaction entity/table may still exist for persistence, but direct repository access
// is discouraged.

/* Deprecated interface kept for reference only
import { Transaction } from "@domain/entities/Transaction";
export interface TransactionRepository {
  findById(id: string): Promise<Transaction | null>;
  save(transaction: Transaction): Promise<void>;
  findByAccountId(accountId: string): Promise<Transaction[]>;
}
*/
