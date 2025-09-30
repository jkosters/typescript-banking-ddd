// TransactionRepositoryImpl is deprecated. Transactions must be created via the Account aggregate.
export class TransactionRepositoryImpl {
  constructor() {
    throw new Error('TransactionRepositoryImpl is deprecated. Use AccountRepositoryImpl to persist transactions via the Account aggregate.');
  }
}
