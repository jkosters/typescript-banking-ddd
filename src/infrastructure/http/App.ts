import express, { Request, Response } from 'express';
import 'express-async-errors';
import { AccountsController } from './AccountsController';

export function createApp(accountController: AccountsController) {
  const app = express();
  app.use(express.json());

  app.get('/health', (_req: Request, res: Response) => res.json({ status: 'ok' }));

  app.use('/accounts', accountController.router);

  // basic error handler
  app.use((err: any, _req: Request, res: Response, _next: any) => {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal error' });
  });

  return app;
}
