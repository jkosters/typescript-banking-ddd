import { CustomerRepository } from '@domain/repositories/CustomerRepository';
import { Customer } from '@domain/entities/Customer';
import { CustomerName } from '@domain/value-objects/CustomerName';
import { Email } from '@domain/value-objects/Email';
import { v4 as uuidv4 } from 'uuid';
import { CustomerCreated } from '@domain/events/CustomerCreated';

export class CustomerService {
  constructor(private repo: CustomerRepository, private eventBus: any) {}

  async createCustomer(firstName: string, lastName: string, email: string): Promise<string> {
    const id = uuidv4();
    const customer = new Customer(id, new CustomerName(firstName, lastName), new Email(email));
    await this.repo.save(customer);
    // publish simple event
    await this.eventBus.publish(new CustomerCreated(id, firstName, lastName, email));
    return id;
  }
}
