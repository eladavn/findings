import { BadRequestException, MiddlewareConsumer, Module, Scope, NestModule, Res } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Request } from 'express';
import {Finding} from '../findings/finding.entity';
import {Resource} from '../findings/resource.entity';

import { TenantDB } from './tenantDB.entity';
import { assert } from 'console';

export const TENANT_DATA_SOURCE = 'TENANT_DATA_SOURCE';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqljs",
      entities: [TenantDB],
      autoSave: true,
      location: 'tenants.sqlite',
      synchronize: true
    }),
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
        const tenantsRepo = rootDataSource.getRepository(TenantDB);
        const requestTenantId = parseInt(request.params.tenantId);
        let tenantDB: TenantDB = await tenantsRepo.findOne(({ where: { tenantId: requestTenantId } }));
        if (!tenantDB) {

          const registeredTenantsCount = await tenantsRepo.count();

          const unregisteredTenantDbIndex = Math.floor(registeredTenantsCount /3) +1;
          tenantDB = tenantsRepo.create({
            tenantId: requestTenantId,
            dbIndex: unregisteredTenantDbIndex
          });

          tenantsRepo.save(tenantDB);

        };

        const dbName = `findings${tenantDB.dbIndex}.sqlite`;
        console.log('Using ' + dbName);

        const tenantDataSource = new DataSource({
          type: "sqljs",
          entities: [Finding,Resource],
          autoSave: true,
          location: dbName,
          synchronize: true
        });
        return await tenantDataSource.initialize();
      }
    }
  ],
  exports: [
    TENANT_DATA_SOURCE
  ]
})
export class TenantDBsModule {};

