import { Module } from '@nestjs/common';
import { FindingsController } from './findings.controller';
import { FindingsService } from './findings.service';
import { TenantDBsModule } from '../tenantDBs/tenantDBs.module';

@Module({
  imports: [TenantDBsModule],
  controllers: [FindingsController],
  providers: [FindingsService]
})
export class FindingsModule {}
