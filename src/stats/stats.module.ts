/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/course/course.entity';
import { BookLoan } from 'src/book-loan/book-loan.entity';
import { events } from 'src/events/events.entity';
import { ComputerLoan } from 'src/computer-loan/computer-loan.entity';
import { Book } from 'src/books/book.entity';
import { User } from 'src/user/user.entity';
import { FriendsLibrary } from 'src/friends-library/friend-library.entity';
import { Attendance } from 'src/attendance/attendance.type';

@Module({
  imports: [TypeOrmModule.forFeature([events, Course, BookLoan,ComputerLoan,Book, User, FriendsLibrary,Attendance])],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
