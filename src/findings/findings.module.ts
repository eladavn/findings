import { Module } from '@nestjs/common';
import { FindingsController } from './findings.controller';
import { FindingsService } from './findings.service';

@Module({
  controllers: [FindingsController],
  providers: [FindingsService]
})
export class FindingsModule {}
