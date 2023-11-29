import { Column, Entity, PrimaryColumn, Index } from 'typeorm';

@Entity()
export class RegisteredTenant {

  @PrimaryColumn()
  @Index({ unique: true })
  tenantId: number;

  @Column()
  dbIndex: number;
}
