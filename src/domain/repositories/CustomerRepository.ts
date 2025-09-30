import { Customer } from "@domain/entities/Customer";

export interface CustomerRepository {
  findById(id: string): Promise<Customer | null>;
  save(customer: Customer): Promise<void>;
}
