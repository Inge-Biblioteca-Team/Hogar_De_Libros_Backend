/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { events } from './events.entity';
import { AdvicesModule } from 'src/advices/advices.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EventsCronService } from './events-cron.service';

@Module({
  imports: [TypeOrmModule.forFeature([events]), AdvicesModule, ScheduleModule.forRoot()],
  controllers: [EventsController],
  providers: [EventsService, EventsCronService],
})
export class EventsModule {}
