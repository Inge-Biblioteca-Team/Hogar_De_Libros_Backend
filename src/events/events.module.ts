/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { events } from './events.entity';

@Module({
  imports:[TypeOrmModule.forFeature([events])],
  controllers: [EventsController],
  providers: [EventsService]
})
export class EventsModule {}
