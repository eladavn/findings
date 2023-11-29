import { Entity, PrimaryColumn, Column, ManyToOne, Index } from "typeorm";
import { Resource } from "./resource.entity";


@Entity()
@Index(['tenantId', 'externalId'], { unique: true })
export class Finding {

    @PrimaryColumn()
    tenantId: number;

    // Assuming this is unique within tenant but not necesarilly globaly
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
