import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('transactions')
export class TransactionEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('uuid')
  account_id!: string;

  @Column('varchar', { length: 20 })
  type!: string;

  @Column('decimal', { precision: 18, scale: 2 })
  amount!: number;

  @Column('varchar', { length: 3 })
  currency!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  occurred_on!: Date;
}
