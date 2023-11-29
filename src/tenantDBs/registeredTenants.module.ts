import { BadRequestException, MiddlewareConsumer, Module, Scope, NestModule, Res } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Request } from 'express';
import {Finding} from '../findings/finding.entity';
import {Resource} from '../findings/resource.entity';

import { RegisteredTenant } from './registeredTenant.entity';
import { assert } from 'console';

export const TENANT_DATA_SOURCE = 'TENANT_DATA_SOURCE';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqljs",
      entities: [RegisteredTenant],
      autoSave: true,
      location: 'registered-tenants.sqlite',
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
      useFactory: async (request : Request, registeredTenantsDataSource : DataSource) => {
        const tenantsRepo = registeredTenantsDataSource.getRepository(RegisteredTenant);
        const requestTenantId = parseInt(request.params.tenantId);
        const registeredTenant: RegisteredTenant = await tenantsRepo.findOne(({ where: { tenantId: requestTenantId } }));
        let dbIndex :number; 
        if (!registeredTenant) {

          if (request.method === 'POST') {
            const registeredTenantsCount = await tenantsRepo.count();

            dbIndex = Math.floor(registeredTenantsCount /3) +1;
            const newRegisteredTenant = tenantsRepo.create({
              tenantId: requestTenantId,
              dbIndex: dbIndex
            });
  
            tenantsRepo.save(newRegisteredTenant);
          }
          else {
            dbIndex = 1;
          }

        }
        else {
          dbIndex = registeredTenant.dbIndex;
        }

        const dbName = `findings${dbIndex}.sqlite`;
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
export class RegisteredTenantsModule {};

