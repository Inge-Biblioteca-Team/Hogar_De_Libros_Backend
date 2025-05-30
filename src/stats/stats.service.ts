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
import { User } from 'src/user/user.entity';
import { FriendsLibrary } from 'src/friends-library/friend-library.entity';
import { Attendance } from 'src/attendance/attendance.type';

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
    @InjectRepository(User)
    private UserRepository: Repository<User>,
    @InjectRepository(FriendsLibrary)
    private FriendRepository: Repository<FriendsLibrary>,
    @InjectRepository(Attendance)
    private AttendanceRepo: Repository<Attendance>,
  ) {}

  async getStats(): Promise<StatsDto[]> {
    const eventStats = await this.eventRepository
      .createQueryBuilder('events')
      .select("DATE_FORMAT(events.Date, '%M %Y') AS month")
      .addSelect('COUNT(events.EventId)', 'Eventos')
      .where('events.Date >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)')
      .andWhere('events.Status = :status', { status: 'Finalizado' })
      .groupBy("DATE_FORMAT(events.Date, '%M %Y')")
      .getRawMany();

    const courseStats = await this.courseRepository
      .createQueryBuilder('courses')
      .select("DATE_FORMAT(courses.date, '%M %Y') AS month")
      .addSelect('COUNT(courses.courseId)', 'Cursos')
      .where('courses.date >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)')
      .andWhere('courses.Status = :status', { status: '0' })
      .groupBy("DATE_FORMAT(courses.date, '%M %Y')")
      .getRawMany();

    const loanStats = await this.loanRepository
      .createQueryBuilder('bookLoan')
      .select("DATE_FORMAT(bookLoan.LoanRequestDate, '%M %Y') AS month")
      .addSelect('COUNT(bookLoan.BookLoanId)', 'Prestamos')
      .where(
        'bookLoan.LoanRequestDate >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)',
      )
      .andWhere('bookLoan.status = :status', { status: 'Finalizado' })
      .groupBy("DATE_FORMAT(bookLoan.LoanRequestDate, '%M %Y')")
      .getRawMany();

    const WSstats = await this.ComputerLoanRepository.createQueryBuilder(
      'computer_loan',
    )
      .select("DATE_FORMAT(computer_loan.LoanStartDate, '%M %Y') AS month")
      .addSelect('COUNT(computer_loan.ComputerLoanId)', 'UsoComputo')
      .where(
        'computer_loan.LoanStartDate >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)',
      )
      .andWhere('computer_loan.Status = :status', { status: 'Finalizado' })
      .groupBy("DATE_FORMAT(computer_loan.LoanStartDate, '%M %Y')")
      .getRawMany();

    const combinedStats: StatsDto[] = this.combineStats(
      eventStats,
      courseStats,
      loanStats,
      WSstats,
    );
    return combinedStats;
  }

  private combineStats(
    eventStats,
    courseStats,
    loanStats,
    WSstats,
  ): StatsDto[] {
    const statsMap = new Map<string, StatsDto>();

    const addToMap = (stat, countField, keyField) => {
      const month = stat[keyField];
      if (!statsMap.has(month)) {
        statsMap.set(month, {
          month,
          Eventos: 0,
          Cursos: 0,
          Prestamos: 0,
          UsoComputo: 0,
        });
      }
      statsMap.get(month)[countField] = parseInt(stat[countField], 10);
    };

    eventStats.forEach((stat) => addToMap(stat, 'Eventos', 'month'));
    courseStats.forEach((stat) => addToMap(stat, 'Cursos', 'month'));
    loanStats.forEach((stat) => addToMap(stat, 'Prestamos', 'month'));
    WSstats.forEach((stat) => addToMap(stat, 'UsoComputo', 'month'));

    return Array.from(statsMap.values());
  }

  async getCalendarItems(): Promise<{ title: string; date: string }[]> {
    const getStartAndEndOfNext7Days = (date: Date) => {
      const startOfPeriod = new Date(date);
      const endOfPeriod = new Date(date);
      startOfPeriod.setHours(0, 0, 0, 0);
      endOfPeriod.setDate(date.getDate() + 7);
      endOfPeriod.setHours(23, 59, 59, 999);
      return { startOfPeriod, endOfPeriod };
    };

    const today = new Date();
    const { startOfPeriod, endOfPeriod } = getStartAndEndOfNext7Days(today);
    const events = await this.eventRepository
      .createQueryBuilder('event')
      .select(['event.Title', 'event.Date', 'event.Time'])
      .where('event.Date >= :startOfPeriod', { startOfPeriod })
      .andWhere('event.Date <= :endOfPeriod', { endOfPeriod })
      .getMany();

    const courses = await this.courseRepository
      .createQueryBuilder('course')
      .select(['course.courseName', 'course.date', 'course.courseTime'])
      .where('course.date >= :startOfPeriod', { startOfPeriod })
      .andWhere('course.date <= :endOfPeriod', { endOfPeriod })
      .getMany();

    const formattedCourses = courses.map((course) => ({
      title: course.courseName,
      date: `${course.date}T${course.courseTime}`,
    }));

    const formattedEvents = events.map((event) => ({
      title: event.Title,
      date: `${event.Date}T${event.Time}`,
    }));

    return [...formattedEvents, ...formattedCourses];
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
      .andWhere('books.status= :status', { status: 1 })
      .getCount();

    const computerLoanCount =
      await this.ComputerLoanRepository.createQueryBuilder(
        'ComputerLoans',
      ).getCount();

    const FriendCount = await this.FriendRepository.createQueryBuilder(
      'FriendsLibrary',
    )
      .andWhere('FriendsLibrary.Status = :status', { status: 'Aprobado' })
      .getCount();

    const UsersCount = await this.UserRepository.createQueryBuilder('Users')
    .where('Users.role = :role',{role:'external_user'})
      .andWhere('Users.status = :status', { status: 1 })
      .getCount();

    const today = new Date();
    const currentYear = new Date().getFullYear();
    const currentMonth = today.getMonth() + 1;

    const Assistencia = await this.AttendanceRepo.createQueryBuilder(
      'attendance',
    )
      .where('YEAR(attendance.date) = :year', { year: currentYear })
      .andWhere('MONTH(attendance.date) = :month', { month: currentMonth })
      .getCount();

    return {
      Eventos: eventCount,
      Cursos: courseCount,
      Prestamos: loanCount,
      Libros: bookCount,
      Equipos: computerLoanCount,
      Amigos: FriendCount,
      Usuarios: UsersCount,
      AsistenciaMes: Assistencia,
    };
  }
  async getSuccessfulCountsCurrentYear() {
    const currentYear = new Date().getFullYear();

    const eventCount = await this.eventRepository
      .createQueryBuilder('events')
      .where('events.Status = :status', { status: 'Finalizado' })
      .andWhere('YEAR(events.Date) = :year', { year: currentYear })
      .getCount();

    const courseCount = await this.courseRepository
      .createQueryBuilder('courses')
      .where('courses.Status = :status', { status: '0' })
      .andWhere('YEAR(courses.date) = :year', { year: currentYear })
      .getCount();

    const loanCount = await this.loanRepository
      .createQueryBuilder('bookLoan')
      .where('bookLoan.status = :status', { status: 'Finalizado' })
      .andWhere('YEAR(bookLoan.LoanRequestDate) = :year', { year: currentYear })
      .getCount();

    const computerLoanCount =
      await this.ComputerLoanRepository.createQueryBuilder('ComputerLoans')
        .where('ComputerLoans.status = :status', { status: 'Finalizado' })
        .andWhere('YEAR(ComputerLoans.LoanExpireDate) = :year', {
          year: currentYear,
        })
        .getCount();

    return {
      EventosExitosos: eventCount,
      CursosExitosos: courseCount,
      PrestamosExitosos: loanCount,
      EquiposExitosos: computerLoanCount,
    };
  }
}
