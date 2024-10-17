/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { RoomReservationService } from './room-reservation.service';
import { RoomReservationController } from './room-reservation.controller';
import { RoomReservation } from './entities/room-reservation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/course/course.entity';
import { User } from 'src/user/user.entity';
import { events } from 'src/events/events.entity';
import { NotesModule } from 'src/notes/notes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomReservation, events, Course, User]), NotesModule
  ],
  controllers: [RoomReservationController],
  providers: [RoomReservationService],
  exports: [RoomReservationService],
})
export class RoomReservationModule {}