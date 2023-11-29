import { Entity, PrimaryColumn, Column, OneToMany, Index } from "typeorm";
import { Finding } from "./finding.entity";


@Entity()
@Index(['cloudAccount', 'uniqueId'], { unique: true })
export class Resource {

    @PrimaryColumn()
    cloudAccount: string;

    // Assuming this is unique within cloud account but not necesarilly globaly
    @PrimaryColumn()
    uniqueId: string;

     @Column()
    name: string;

    @OneToMany(() => Finding, (finding) => finding.resource)
    findings: Promise<Finding[]>;
}

