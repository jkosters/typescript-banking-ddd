import { Repository } from 'typeorm';
import { TransactionReadEntity } from '../../read-models/TransactionReadEntity';

export class TransactionReadRepository {
  constructor(private ormRepo: Repository<TransactionReadEntity>) {}

  async findByAccountId(accountId: string, page = 0, size = 20) {
    return this.ormRepo.find({ where: { account_id: accountId }, order: { occurred_on: 'DESC' }, skip: page * size, take: size });
  }

  async upsert(entity: TransactionReadEntity) {
    await this.ormRepo.save(entity);
  }
}
