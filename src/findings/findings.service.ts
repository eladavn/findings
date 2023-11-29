import { Injectable, Inject } from '@nestjs/common';
import { Finding } from './finding.entity';
import { DataSource, Repository } from 'typeorm';
import { TENANT_DATA_SOURCE } from '../tenantDBs/registeredTenants.module';
import { threadId } from 'worker_threads';

@Injectable()
export class FindingsService {

    private readonly findingsRepo: Repository<Finding>

    constructor(
        @Inject(TENANT_DATA_SOURCE) tenantDataSource : DataSource
    ) {
        this.findingsRepo = tenantDataSource.getRepository(Finding);
    }

    async findAll(tenantId : number) : Promise<Finding[]> {
        return this.findingsRepo.find({
            where: {
                tenantId: tenantId
            },
            relations: {
                resource: true
            }
        });
    }

    async create(finding: Finding) :Promise<Finding> {
        const newFinding = this.findingsRepo.create(finding);
        return this.findingsRepo.save(newFinding);
    }

} 
