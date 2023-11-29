import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FindingsModule } from './findings/findings.module';
import { TenantDBsModule } from './tenantDBs/tenantDBs.module';
import { TypeOrmModule } from '@nestjs/typeorm/dist';

import { TenantDB } from './tenantDBs/tenantDB.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqljs",
      entities: [TenantDB],
      autoSave: true,
      location: 'tenants.sqlite',
      synchronize: true
    }),
    TenantDBsModule,
    FindingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
