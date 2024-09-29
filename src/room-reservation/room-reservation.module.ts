import { Module } from '@nestjs/common';
import { RoomReservationService } from './room-reservation.service';
import { RoomReservationController } from './room-reservation.controller';
import { RoomReservation } from './entities/room-reservation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/course/course.entity';
import { User } from 'src/user/user.entity';
import { events } from 'src/events/events.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomReservation, events, Course, User]), 
  ],
  controllers: [RoomReservationController],
  providers: [RoomReservationService],
  exports: [RoomReservationService],
})
export class RoomReservationModule {}