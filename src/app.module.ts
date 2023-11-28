import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FindingsModule } from './findings/findings.module';
import { TypeOrmModule } from '@nestjs/typeorm/dist';

@Module({
  imports: [
    FindingsModule,
    TypeOrmModule.forRoot({
      type: "sqljs",
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      autoSave: true,
      location: 'findings.sqlite'
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
