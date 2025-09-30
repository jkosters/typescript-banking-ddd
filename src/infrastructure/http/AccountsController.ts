import { Router, Request, Response } from 'express';
import { AccountService } from '@application/AccountService';

export class AccountsController {
  public router = Router();

  constructor(private service: AccountService) {
    this.router.post('/', this.openAccount.bind(this));
    this.router.post('/:id/deposit', this.deposit.bind(this));
    this.router.post('/:id/withdraw', this.withdraw.bind(this));
    this.router.get('/:id', this.getAccount.bind(this));
  }

  async openAccount(req: Request, res: Response) {
    const { initialAmount, currency } = req.body;
    const id = await this.service.openAccount(Number(initialAmount), currency);
    res.status(201).json({ id });
  }

  async deposit(req: Request, res: Response) {
    const { id } = req.params;
    const { amount, currency } = req.body;
    await this.service.deposit(id, Number(amount), currency);
    res.status(200).json({ ok: true });
  }

  async withdraw(req: Request, res: Response) {
    const { id } = req.params;
    const { amount, currency } = req.body;
    await this.service.withdraw(id, Number(amount), currency);
    res.status(200).json({ ok: true });
  }

  async getAccount(req: Request, res: Response) {
    const { id } = req.params;
  const account = await this.service.getAccount(id);
  if (!account) return res.status(404).json({ error: 'Not found' });
  res.json(account);
  }
}
