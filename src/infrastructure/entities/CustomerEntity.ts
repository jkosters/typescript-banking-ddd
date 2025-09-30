import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('customers')
export class CustomerEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('varchar', { length: 100 })
  first_name!: string;

  @Column('varchar', { length: 100 })
  last_name!: string;

  @Column('varchar', { length: 255 })
  email!: string;

  @Column('boolean')
  is_active!: boolean;
}
