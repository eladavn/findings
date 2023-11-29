import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FindingsModule } from './findings/findings.module';
import { TypeOrmModule } from '@nestjs/typeorm/dist';

@Module({
  imports: [
    FindingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
