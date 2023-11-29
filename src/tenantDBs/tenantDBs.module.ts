import { BadRequestException, MiddlewareConsumer, Module, Scope, NestModule, Res } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Request } from 'express';
import {Finding} from '../findings/finding.entity';
import {Resource} from '../findings/resource.entity';

import { TenantDB } from './tenantDB.entity';

export const TENANT_DATA_SOURCE = 'TENANT_DATA_SOURCE';

@Module({
  imports: [
    TypeOrmModule.forFeature([TenantDB]),
  ],
  providers: [
    {
      provide: TENANT_DATA_SOURCE,
      inject: [
        REQUEST,
        DataSource,
      ],
      scope: Scope.REQUEST,
      useFactory: async (request : Request, rootDataSource : DataSource) => {
        const tenantDB: TenantDB = await rootDataSource.getRepository(TenantDB).findOne(({ where: { tenantId: parseInt(request.params.tenantId) } }));
        const tenantDataSource = new DataSource({
          type: "sqljs",
          entities: [Finding,Resource],
          autoSave: true,
          location: `findings${tenantDB.dbIndex}.sqlite`,
          synchronize: true
        });
        return tenantDataSource;
      }
    }
  ],
  exports: [
    TENANT_DATA_SOURCE
  ]
})
export class TenantModule {};

