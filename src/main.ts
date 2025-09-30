import "reflect-metadata";
import { DataSource } from "typeorm";
import { AccountEntity } from "@infrastructure/entities/AccountEntity";
import { CustomerEntity } from "@infrastructure/entities/CustomerEntity";
import { TransactionEntity } from "@infrastructure/entities/TransactionEntity";
import { EventBus } from "@infrastructure/events/EventBus";
import { AccountRepositoryImpl } from "@infrastructure/repositories/AccountRepositoryImpl";
import { AccountService } from "@application/AccountService";
import { AccountFactory } from "@domain/factories/AccountFactory";
import { SendDepositNotification } from "@application/event-handlers/SendDepositNotification";
import { RecordDepositAudit } from "@application/event-handlers/RecordDepositAudit";
import { createApp } from "@infrastructure/http/App";
import { AccountsController } from "@infrastructure/http/AccountsController";

async function main() {
  const dataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5432),
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASS || "postgres",
    database: process.env.DB_NAME || "banking_demo",
    synchronize: true,
    logging: false,
    entities: [AccountEntity]
  });

  await dataSource.initialize();

  const eventBus = new EventBus();
  eventBus.register("FundsDeposited", new SendDepositNotification());
  eventBus.register("FundsDeposited", new RecordDepositAudit());
  eventBus.register("FundsWithdrawn", new RecordDepositAudit());

  const ormRepo = dataSource.getRepository(AccountEntity);
  const txOrm = dataSource.getRepository(TransactionEntity);
  const repo = new AccountRepositoryImpl(ormRepo, eventBus, txOrm as any);
  const factory = new AccountFactory();
  const service = new AccountService(repo, factory);

  // customer & transaction repositories
  const customerOrm = dataSource.getRepository(CustomerEntity);
  const transactionOrm = dataSource.getRepository(TransactionEntity);
  // repository impls are lazily importable where needed; construct here if desired
  // const customerRepo = new CustomerRepositoryImpl(customerOrm);
  // const transactionRepo = new TransactionRepositoryImpl(transactionOrm);

  const accountsController = new AccountsController(service);

  // instantiate customer/transaction services and controllers
  // lazy import implementations to avoid circular deps
  const { CustomerRepositoryImpl } = await import('@infrastructure/repositories/CustomerRepositoryImpl');
  const customerRepo = new CustomerRepositoryImpl(customerOrm as any);

  const { CustomerService } = await import('@application/CustomerService');
  const { TransactionService } = await import('@application/TransactionService');
  const { CustomersController } = await import('@infrastructure/http/CustomersController');
  const { TransactionsController } = await import('@infrastructure/http/TransactionsController');

  const customerService = new CustomerService(customerRepo, eventBus);
  // transactionService delegates to AccountService to mutate aggregates
  const transactionService = new TransactionService(service);

  const customersController = new CustomersController(customerService);
  const transactionsController = new TransactionsController(transactionService);

  const app = createApp(accountsController, customersController, transactionsController);

  const port = Number(process.env.PORT || 3000);
  app.listen(port, () => console.log(`HTTP server listening on port ${port}`));
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
