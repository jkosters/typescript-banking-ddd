import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('read_accounts')
export class AccountReadEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('decimal', { precision: 18, scale: 2 })
  balance_amount!: number;

  @Column('varchar', { length: 3 })
  balance_currency!: string;

  @Column('boolean')
  is_active!: boolean;
}
