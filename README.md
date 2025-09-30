# Banking DDD Demo (TypeScript + TypeORM)

Minimal demo project that demonstrates a DDD-style banking system:
- Value Objects (Money)
- Entities / Aggregate Root (Account)
- Factory (AccountFactory)
- Specifications (MinimumBalance, AccountActive)
- Domain Events (FundsDeposited, FundsWithdrawn)
- Repository (interface + TypeORM implementation)
- EventBus and EventHandlers

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure Postgres (or change DataSource config in `src/main.ts`).

3. Start:
   ```bash
   npm run dev
   ```

The demo will create an account, deposit, and withdraw, printing domain events and handler output to the console.
