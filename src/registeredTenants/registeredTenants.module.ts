import { BadRequestException, MiddlewareConsumer, Module, Scope, NestModule, Res } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Request } from 'express';
import {Finding} from '../findings/finding.entity';
import {Resource} from '../findings/resource.entity';

import { RegisteredTenant } from './registeredTenant.entity';

export const TENANT_DATA_SOURCE = 'TENANT_DATA_SOURCE';

async function registerNewTenant(tenantsRepo, requestTenantId: number) {
  const registeredTenantsCount = await tenantsRepo.count();

  // Since the list of registered tenants is append only, a newly introduced tenant must get the last used
  // DB or a newly created one.
  const dbIndex = Math.floor(registeredTenantsCount / 3) + 1;
  const newRegisteredTenant = tenantsRepo.create({
    tenantId: requestTenantId,
    dbIndex: dbIndex
  });

  tenantsRepo.save(newRegisteredTenant);
  return dbIndex;
}

async function getDbIndex(request : Request, registeredTenantsDataSource: DataSource) : Promise<number> {
  const tenantsRepo = registeredTenantsDataSource.getRepository(RegisteredTenant);
  const requestTenantId = parseInt(request.params.tenantId);
  const registeredTenant = await tenantsRepo.findOne(({ where: { tenantId: requestTenantId } }));
  if (registeredTenant) {
    // Tenant already registered
    return registeredTenant.dbIndex;
  }

  // Tenant was never registered

  if (request.method != 'POST') {
    // The given tenant was never registered and it shouldn't be registered here as well 
    // (as registration is relevant only for POST request)
    // So the given tenant is not to be found in any of the DBs, so just work
    // with arbitrary DB which would result in standard entity not available behavior
    //
    // Note: There is an ugly abstraction leakage here since this module by this logic is aware
    // of the logic of the findings module by knowing that only with POST of finding a tenant
    // should be registered. 
    // A better approach would be to inject a callback which will be implemented by the finding module
    // and tells whether unfound tenant should be registered.
    return 1;
  }

  return registerNewTenant(tenantsRepo, requestTenantId);
}


async function createTenantDataSource(request : Request, registeredTenantsDataSource : DataSource) : Promise<DataSource> {
  
  let dbIndex: number = await getDbIndex(request, registeredTenantsDataSource);

  const dbName = `findings${dbIndex}.sqlite`;
  console.log('Using ' + dbName);

  const tenantDataSource = new DataSource({
    type: "sqljs",
    entities: [Finding,Resource],
    autoSave: true,
    location: dbName,
    synchronize: true
  });

  return tenantDataSource.initialize();
}


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
      useFactory: createTenantDataSource
    }
  ],
  exports: [
    TENANT_DATA_SOURCE
  ]
})
export class RegisteredTenantsModule {};




