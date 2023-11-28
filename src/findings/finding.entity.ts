import { Entity, PrimaryColumn, Column, ManyToOne,  } from "typeorm";
import { Resource } from "./resource.entity";


@Entity()
export class Finding {

    @PrimaryColumn()
    tenantId: number;

    @PrimaryColumn()
    externalId: string;

     @Column()
    type: string;

    @ManyToOne(() => Resource, (resource) => resource.findings, {
        cascade: true
    })
    resource : Resource;
}

export type FindingInTenant = Omit<Finding,"tenantId">;
