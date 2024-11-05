/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookLoan } from 'src/book-loan/book-loan.entity';
import { Course } from 'src/course/course.entity';
import { events } from 'src/events/events.entity';
import { Repository } from 'typeorm';
import { StatsDto } from './dto/StatsDto';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(events)
    private eventRepository: Repository<events>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(BookLoan)
    private loanRepository: Repository<BookLoan>,
  ) {}

  async getStats(): Promise<StatsDto[]> {
    const eventStats = await this.eventRepository
      .createQueryBuilder('events')
      .select("DATE_FORMAT(events.Date, '%M %Y') AS month")
      .addSelect('COUNT(events.EventId)', 'Eventos')
      .where('events.Date >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)')
      .groupBy("DATE_FORMAT(events.Date, '%M %Y')")
      .getRawMany();

    const courseStats = await this.courseRepository
      .createQueryBuilder('courses')
      .select("DATE_FORMAT(courses.date, '%M %Y') AS month")
      .addSelect('COUNT(courses.courseId)', 'Cursos')
      .where('courses.date >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)')
      .groupBy("DATE_FORMAT(courses.date, '%M %Y')")
      .getRawMany();

    const loanStats = await this.loanRepository
      .createQueryBuilder('bookLoan')
      .select("DATE_FORMAT(bookLoan.LoanRequestDate, '%M %Y') AS month")
      .addSelect('COUNT(bookLoan.BookLoanId)', 'Prestamos')
      .where(
        'bookLoan.LoanRequestDate >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)',
      )
      .groupBy("DATE_FORMAT(bookLoan.LoanRequestDate, '%M %Y')")
      .getRawMany();

    const combinedStats: StatsDto[] = this.combineStats(
      eventStats,
      courseStats,
      loanStats,
    );
    return combinedStats;
  }

  private combineStats(eventStats, courseStats, loanStats): StatsDto[] {
    const statsMap = new Map<string, StatsDto>();

    const addToMap = (stat, countField, keyField) => {
      const month = stat[keyField];
      if (!statsMap.has(month)) {
        statsMap.set(month, {
          month,
          Eventos: 0,
          Cursos: 0,
          Prestamos: 0,
        });
      }
      statsMap.get(month)[countField] = parseInt(stat[countField], 10);
    };

    eventStats.forEach((stat) => addToMap(stat, 'Eventos', 'month'));
    courseStats.forEach((stat) => addToMap(stat, 'Cursos', 'month'));
    loanStats.forEach((stat) => addToMap(stat, 'Prestamos', 'month'));

    return Array.from(statsMap.values());
  }
}
