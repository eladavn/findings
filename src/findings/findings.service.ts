import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Finding } from './finding.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindingsService {
    constructor(
        @InjectRepository(Finding)
        private findingRepo: Repository<Finding>
    ) {}

    async findAll(tenantId : number) : Promise<Finding[]> {
        return this.findingRepo.find({
            where: {
                tenantId: tenantId
            },
            relations: {
                resource: true
            }
        });
    }

    async create(finding: Finding) :Promise<Finding> {
        const newFinding = this.findingRepo.create(finding);
        return this.findingRepo.save(newFinding);
    }

} 
