import { Column, Entity, PrimaryColumn, Index } from 'typeorm';

@Entity()
export class TenantDB {

  @PrimaryColumn()
  @Index({ unique: true })
  tenantId: number;

  @Column()
  dbIndex: number;
}
