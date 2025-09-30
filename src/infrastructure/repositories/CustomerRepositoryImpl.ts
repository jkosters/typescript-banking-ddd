import { Repository } from 'typeorm';
import { CustomerRepository } from '@domain/repositories/CustomerRepository';
import { Customer } from '@domain/entities/Customer';
import { CustomerEntity } from '@infrastructure/entities/CustomerEntity';
import { CustomerName } from '@domain/value-objects/CustomerName';
import { Email } from '@domain/value-objects/Email';

export class CustomerRepositoryImpl implements CustomerRepository {
  constructor(private ormRepo: Repository<CustomerEntity>) {}

  async findById(id: string): Promise<Customer | null> {
    const e = await this.ormRepo.findOneBy({ id });
    if (!e) return null;
    const customer = new Customer(e.id, new CustomerName(e.first_name, e.last_name), new Email(e.email));
    if (!e.is_active) customer.deactivate();
    return customer;
  }

  async save(customer: Customer): Promise<void> {
    const e = new CustomerEntity();
    e.id = customer.id;
    e.first_name = customer.name.firstName;
    e.last_name = customer.name.lastName;
    e.email = customer.email.value;
    e.is_active = customer.isActive();
    await this.ormRepo.save(e);
  }
}
