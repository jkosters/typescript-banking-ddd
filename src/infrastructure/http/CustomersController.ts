import { Router, Request, Response } from 'express';
import { CustomerService } from '@application/CustomerService';

export class CustomersController {
  public router = Router();

  constructor(private service: CustomerService) {
    this.router.post('/', this.createCustomer.bind(this));
    this.router.get('/:id', this.getCustomer.bind(this));
  }

  async createCustomer(req: Request, res: Response) {
    const { firstName, lastName, email } = req.body;
    const id = await this.service.createCustomer(firstName, lastName, email);
    res.status(201).json({ id });
  }

  async getCustomer(req: Request, res: Response) {
    const { id } = req.params;
    // lightweight read via repository directly would be implemented elsewhere; for now return 404
    res.status(204).end();
  }
}
