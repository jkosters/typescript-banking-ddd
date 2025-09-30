import { Router, Request, Response } from 'express';
import { PaymentService } from '@application/PaymentService';

export class PaymentsController {
  public router = Router();
  constructor(private service: PaymentService) {
    this.router.post('/charge', this.charge.bind(this));
  }

  async charge(req: Request, res: Response) {
    const { requestId, accountId, amount, currency } = req.body;
    const result = await this.service.charge(requestId, accountId, Number(amount), currency);
    if (!result.success) return res.status(502).json({ error: result.errorCode });
    res.status(201).json({ providerReference: result.providerReference, settledAt: result.settledAt });
  }
}
