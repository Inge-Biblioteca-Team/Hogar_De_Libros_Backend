/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookLoan } from 'src/book-loan/book-loan.entity';
import { Course } from 'src/course/course.entity';
import { events } from 'src/events/events.entity';
import { Repository } from 'typeorm';
import { StatsDto } from './dto/StatsDto';
import { Book } from 'src/books/book.entity';
import { ComputerLoan } from 'src/computer-loan/computer-loan.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(events)
    private eventRepository: Repository<events>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(BookLoan)
    private loanRepository: Repository<BookLoan>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(ComputerLoan)
    private ComputerLoanRepository: Repository<ComputerLoan>,
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

  async getGeneralCounts() {
    const eventCount = await this.eventRepository
      .createQueryBuilder('events')
      .getCount();
  
    const courseCount = await this.courseRepository
      .createQueryBuilder('courses')
      .getCount();
  
    const loanCount = await this.loanRepository
      .createQueryBuilder('bookLoan')
      .getCount();
  
    const bookCount = await this.bookRepository
      .createQueryBuilder('books')
      .getCount();
  
    const computerLoanCount = await this.ComputerLoanRepository
      .createQueryBuilder('ComputerLoans')
      .getCount();
  
    return {
      Eventos: eventCount,
      Cursos: courseCount,
      Prestamos: loanCount,
      Libros: bookCount,
      Equipos: computerLoanCount,
    };
    
    }
  async getSuccessfulCountsCurrentYear() {
    const currentYear = new Date().getFullYear(); 
  
    const eventCount = await this.eventRepository
      .createQueryBuilder('events')
      .where('events.status = :status', { status: 'Cancelado' })
      .andWhere('YEAR(events.Date) = :year', { year: currentYear }) 
      .getCount();
  
    const courseCount = await this.courseRepository
      .createQueryBuilder('courses')
      .where('courses.status = :status', { status: 'Cancelado' })
      .andWhere('YEAR(courses.date) = :year', { year: currentYear }) 
      .getCount();
  
    const loanCount = await this.loanRepository
      .createQueryBuilder('bookLoan')
      .where('bookLoan.status = :status', { status: 'Finalizado' })
      .andWhere('YEAR(bookLoan.LoanRequestDate) = :year', { year: currentYear }) 
      .getCount();
  
    const computerLoanCount = await this.ComputerLoanRepository
      .createQueryBuilder('ComputerLoans')
      .where('ComputerLoans.status = :status', { status: 'Finalizado' })
      .andWhere('YEAR(ComputerLoans.LoanExpireDate) = :year', { year: currentYear }) 
      .getCount();
  
    return {
      EventosExitosos: eventCount,
      CursosExitosos: courseCount,
      PrestamosExitosos: loanCount,
      EquiposExitosos: computerLoanCount,
    };
  }
  
}
