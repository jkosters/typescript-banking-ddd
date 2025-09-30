import { Router, Request, Response } from 'express';
import { TransactionService } from '@application/TransactionService';

export class TransactionsController {
  public router = Router();

  constructor(private service: TransactionService) {
    this.router.post('/', this.createTransaction.bind(this));
    this.router.get('/account/:accountId', this.listByAccount.bind(this));
  }

  async createTransaction(req: Request, res: Response) {
    const { accountId, type, amount, currency } = req.body;
    const id = await this.service.createTransaction(accountId, type, Number(amount), currency);
    res.status(201).json({ id });
  }

  async listByAccount(req: Request, res: Response) {
    const { accountId } = req.params;
    const items = await this.service.findByAccount(accountId);
    res.json(items.map(i => ({ id: i.id, accountId: i.accountId, type: i.type, amount: i.amount.amount, currency: i.amount.currency, occurredOn: i.occurredOn })));
  }
}
