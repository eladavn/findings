import { Entity, PrimaryColumn, CreateDateColumn, Column, ManyToOne, Index, Check } from "typeorm";
import { Resource } from "./resource.entity";

export enum Severity {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
}

@Entity()
@Check(`"severity" IN ('${Severity.LOW}', '${Severity.MEDIUM}', '${Severity.HIGH}')`)
@Index(['tenantId', 'externalId'], { unique: true })
export class Finding {

    @PrimaryColumn()
    tenantId: number;

    // Assuming this is unique within tenant but not necesarilly globaly
    @PrimaryColumn()
    externalId: string;

    @Column()
    type: string;

    @Column()
    title: string;

    @Column()
    severity : Severity;

    @CreateDateColumn()
    createdAt : Date;

    @Column()
    sensor : string;
 
    @ManyToOne(() => Resource, (resource) => resource.findings, {
        cascade: true
    })
    resource : Resource;
}

export type FindingInTenant = Omit<Finding,"tenantId">;
