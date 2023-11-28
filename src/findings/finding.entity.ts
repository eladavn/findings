import { Entity, PrimaryColumn, Column,  } from "typeorm";


@Entity()
export class Finding {

    @PrimaryColumn()
    tenantId: number;

    @PrimaryColumn()
    externalId: string;

     @Column()
    type: string;
}

export type FindingInTenant = Omit<Finding,"tenantId">;
