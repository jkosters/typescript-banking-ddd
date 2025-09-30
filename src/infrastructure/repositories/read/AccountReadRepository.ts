import { Repository } from 'typeorm';
import { AccountReadEntity } from '../../read-models/AccountReadEntity';

export class AccountReadRepository {
  constructor(private ormRepo: Repository<AccountReadEntity>) {}

  async findById(id: string) {
    return this.ormRepo.findOneBy({ id });
  }

  async upsert(entity: AccountReadEntity) {
    await this.ormRepo.save(entity);
  }
}
