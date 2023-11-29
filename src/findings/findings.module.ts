import { Module } from '@nestjs/common';
import { FindingsController } from './findings.controller';
import { FindingsService } from './findings.service';
import { RegisteredTenantsModule } from '../registeredTenants/registeredTenants.module';

@Module({
  imports: [RegisteredTenantsModule],
  controllers: [FindingsController],
  providers: [FindingsService]
})
export class FindingsModule {}
