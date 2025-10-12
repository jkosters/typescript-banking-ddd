import { Account } from "../entities/Account";

export interface AccountRepository {
  findById(id: string): Promise<Account | null>;
  save(account: Account): Promise<void>;
  // persist multiple accounts atomically (optional)
  saveAll?(accounts: Account[]): Promise<void>;
}
