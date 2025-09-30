import { Router, Request, Response } from 'express';
import { AccountReadRepository } from '@infrastructure/repositories/read/AccountReadRepository';

export class ReadAccountsController {
  public router = Router();
  constructor(private repo: AccountReadRepository) {
    this.router.get('/:id', this.get.bind(this));
    this.router.get('/:id/transactions', this.getTransactions.bind(this));
  }

  async get(req: Request, res: Response) {
    const { id } = req.params;
    const entity = await this.repo.findById(id);
    if (!entity) return res.status(404).json({ error: 'not found' });
    res.json({ id: entity.id, balance: { amount: Number(entity.balance_amount), currency: entity.balance_currency }, active: entity.is_active });
  }

  async getTransactions(req: Request, res: Response) {
    const { id } = req.params;
    const page = Number(req.query.page || 0);
    const size = Number(req.query.size || 20);
    const { TransactionReadRepository } = await import('@infrastructure/repositories/read/TransactionReadRepository');
    const txRepo = new TransactionReadRepository((this.repo as any).ormRepo.manager.getRepository((await import('@infrastructure/read-models/TransactionReadEntity')).TransactionReadEntity) as any);
    const rows = await txRepo.findByAccountId(id, page, size);
    res.json(rows.map(r => ({ id: r.id, accountId: r.account_id, type: r.type, amount: Number(r.amount), currency: r.currency, occurredOn: r.occurred_on })));
  }
}
