import { Entity, PrimaryColumn, Column,  } from "typeorm";

@Entity()
export class Finding {

    @PrimaryColumn()
    externalId: string;

    @PrimaryColumn()
    tenantId: number;

    @Column()
    type: string;
}