/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ReportController } from './Reports.Controller';
import { ReportService } from './Reports.Service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComputerLoan } from 'src/computer-loan/computer-loan.entity';
import { BookLoan } from 'src/book-loan/book-loan.entity';
import { Course } from 'src/course/course.entity';
import { events } from 'src/events/events.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ComputerLoan, BookLoan, Course, events])],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
