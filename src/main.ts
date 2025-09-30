import "reflect-metadata";
import { DataSource } from "typeorm";
import { AccountEntity } from "@infrastructure/entities/AccountEntity";
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
  const repo = new AccountRepositoryImpl(ormRepo, eventBus);
  const factory = new AccountFactory();
  const service = new AccountService(repo, factory);

  const accountsController = new AccountsController(service);
  const app = createApp(accountsController);

  const port = Number(process.env.PORT || 3000);
  app.listen(port, () => console.log(`HTTP server listening on port ${port}`));
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
