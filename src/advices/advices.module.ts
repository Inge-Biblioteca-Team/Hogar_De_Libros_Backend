/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AdvicesService } from './advices.service';
import { AdvicesController } from './advices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Advice } from './entities/advice.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { AdviceJobs } from './AdviceJobs.Service';


@Module({
  imports: [TypeOrmModule.forFeature([Advice]), ScheduleModule.forRoot()],
  controllers: [AdvicesController],
  providers: [AdvicesService, AdviceJobs],
  exports: [AdvicesService]
})
export class AdvicesModule {}
