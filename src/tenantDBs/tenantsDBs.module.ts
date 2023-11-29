import { BadRequestException, MiddlewareConsumer, Module, Scope, NestModule } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Request } from 'express';

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
      useFactory: async (request : Request, dataSource : DataSource) => {
        const tenantDB: TenantDB = await dataSource.getRepository(TenantDB).findOne(({ where: { tenantId: parseInt(request.params.tenantId) } }));
        return tenantDB.dbIndex;
      }
    }
  ],
  exports: [
    TENANT_DATA_SOURCE
  ]
})
export class TenantModule implements NestModule {
  constructor(private readonly connection: Connection) { }

  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(async (req, res, next) => {

        const tenant: Tenant = await this.connection.getRepository(Tenant).findOne(({ where: { host: req.headers.host } }));

        if (!tenant) {
          throw new BadRequestException(
            'Database Connection Error',
            'There is a Error with the Database!',
          );
        }

        try {
          getConnection(tenant.name);
          next();
        } catch (e) {

          const createdConnection: Connection = await createConnection({
            name: tenant.name,
            type: "mysql",
            host: "localhost",
            port: 3307,
            username: 'root',
            password: 'root',
            database: tenant.name,
            entities: [ Book ],
            synchronize: true,
          })

          if (createdConnection) {
            next();
          } else {
            throw new BadRequestException(
              'Database Connection Error',
              'There is a Error with the Database!',
            );
          }
        }
      }).forRoutes('*');
  }
}

