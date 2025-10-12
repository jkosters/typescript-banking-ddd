import { Router, Request, Response } from 'express';
import { TransferService } from '@domain/services/TransferService';

export class TransfersController {
  public router = Router();
  constructor(private service: TransferService) {
    this.router.post('/', this.create.bind(this));
  }

  async create(req: Request, res: Response) {
    const { requestId, fromAccountId, toAccountId, amount, currency } = req.body;
    try {
      const result = await this.service.transfer(requestId, fromAccountId, toAccountId, Number(amount), currency);
      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
