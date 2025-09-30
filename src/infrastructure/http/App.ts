import express, { Request, Response } from 'express';
import 'express-async-errors';
import { AccountsController } from './AccountsController';
import { CustomersController } from './CustomersController';
import { TransactionsController } from './TransactionsController';

export function createApp(accountController: AccountsController, customersController?: any, transactionsController?: any, readAccountsController?: any) {
  const app = express();
  app.use(express.json());

  app.get('/health', (_req: Request, res: Response) => res.json({ status: 'ok' }));

  app.use('/accounts', accountController.router);
  if (customersController) app.use('/customers', customersController.router);
  if (transactionsController) app.use('/transactions', transactionsController.router);
  if (readAccountsController) app.use('/read/accounts', readAccountsController.router);

  // basic error handler
  app.use((err: any, _req: Request, res: Response, _next: any) => {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal error' });
  });

  return app;
}
