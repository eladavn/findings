import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { Finding } from "./finding.entity";


@Entity()
export class Resource {

    @PrimaryColumn()
    cloudAccount: string;

    @PrimaryColumn()
    uniqueId: string;

     @Column()
    name: string;

    @OneToMany(() => Finding, (finding) => finding.resource)
    findings: Promise<Finding[]>;
}

