/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ReportController } from './Reports.Controller';
import { ReportService } from './Reports.Service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComputerLoan } from 'src/computer-loan/computer-loan.entity';
import { BookLoan } from 'src/book-loan/book-loan.entity';
import { Course } from 'src/course/course.entity';
import { events } from 'src/events/events.entity';
import { Attendance } from 'src/attendance/attendance.type';
import { User } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ComputerLoan, BookLoan, Course, events, Attendance, User])],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
