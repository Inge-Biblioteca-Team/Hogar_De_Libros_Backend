/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/course/course.entity';
import { BookLoan } from 'src/book-loan/book-loan.entity';
import { events } from 'src/events/events.entity';

@Module({
  imports: [TypeOrmModule.forFeature([events, Course, BookLoan])],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
