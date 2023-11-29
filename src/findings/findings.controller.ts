import { Body, Controller, Get, Param, Post} from '@nestjs/common';
import { FindingsService } from './findings.service';
import { Finding, FindingInTenant } from './finding.entity';

// TODO: The 'tenantId' request param should be a reusable const. It should also be exported and reused in the
// tenantsDBs module
@Controller('tenants/:tenantId/findings')
export class FindingsController {
    constructor(private readonly findingsService: FindingsService) {}

    @Get()
    async findAll(@Param('tenantId') tenantId : number ) : Promise<Finding[]> {
        const findings = await this.findingsService.findAll(tenantId);

        return findings;

    }

    @Post()
    async create(@Param('tenantId') tenantId: number, @Body() findingInTenant : FindingInTenant) : Promise<Finding> {

        const findingToCreate = {tenantId: tenantId, ...findingInTenant};

        return await this.findingsService.create(findingToCreate);

    }

}

