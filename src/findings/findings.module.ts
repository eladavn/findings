import { Module } from '@nestjs/common';
import { FindingsController } from './findings.controller';
import { FindingsService } from './findings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Finding } from './finding.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Finding])],
  controllers: [FindingsController],
  providers: [FindingsService]
})
export class FindingsModule {}
