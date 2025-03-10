/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { ReportDto } from './DTO';
import * as path from 'path';
import * as fs from 'fs';
import * as Handlebars from 'handlebars';
import puppeteer from 'puppeteer';
import { InjectRepository } from '@nestjs/typeorm';
import { ComputerLoan } from 'src/computer-loan/computer-loan.entity';
import { Between, In, Repository } from 'typeorm';
import { BookLoan } from 'src/book-loan/book-loan.entity';
import { Course } from 'src/course/course.entity';
import { events } from 'src/events/events.entity';
import { format } from '@formkit/tempo';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(ComputerLoan)
    private loanRepository: Repository<ComputerLoan>,
    @InjectRepository(BookLoan)
    private bookLoanRepository: Repository<BookLoan>,

    @InjectRepository(Course)
    private courseRepository: Repository<Course>,

    @InjectRepository(events)
    private eventRepository: Repository<events>,
  ) {}

  static registerHelpers() {
    Handlebars.registerHelper(
      'formatDate',
      function (date: Date, type: string) {
        if (!date) {
          return 'N/A';
        }

        if (type === 'date') {
          return format(date, 'DD/MM/YY', 'es');
        } else if (type === 'datetime') {
          return format(date, 'DD/MM/YY h:mm a', 'es');
        }
        return date;
      },
    );
  }

  static registerdateHelpers() {
    Handlebars.registerHelper('formatOnlyDate', function (dateStr: string) {
      if (!dateStr) return '';

      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;

      return format(dateStr, 'DD/MM/YY', 'es');
    });
  }

  async generateWSLoans(params: ReportDto): Promise<Buffer> {
    const { startDate, endDate } = params;

    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T23:59:59`);

    const prestamos = await this.loanRepository.find({
      where: {
        LoanStartDate: Between(start, end),
      },
      order: { LoanStartDate: 'ASC' },
    });

    if (prestamos.length == 0) {
      const [year, month, day] = startDate.split('-');
      const [endYear, endMonth, endDay] = endDate.split('-');

      const startDateObj = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
      );
      const endDateObj = new Date(
        parseInt(endYear),
        parseInt(endMonth) - 1,
        parseInt(endDay),
      );

      startDateObj.setHours(0, 0, 0, 0);
      endDateObj.setHours(23, 59, 59, 999);

      const startDateFormatted = startDateObj.toLocaleDateString('es-CR');
      const endDateFormatted = endDateObj.toLocaleDateString('es-CR');

      throw new NotFoundException({
        message: `No existen prestamos dentro del rango de fechas ${startDateFormatted} a ${endDateFormatted}`,
        error: 'Not Found',
      });
    }

    ReportService.registerHelpers();

    const templatePath = path.join(
      process.cwd(),
      'src/Reports/Templates/WSLoanTemplate.hbs',
    );

    const templateHtml = fs.readFileSync(templatePath, 'utf-8');
    const template = Handlebars.compile(templateHtml);

    const htmlContent = template({
      startDate: startDate,
      endDate: endDate,
      WSLoans: prestamos,
      generateDate: new Date().toLocaleString(),
    });
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent);

    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();
    return Buffer.from(pdfBuffer);
  }

  async generateBLoans(params: ReportDto): Promise<Buffer> {
    const { startDate, endDate } = params;

    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T23:59:59`);

    const prestamos = await this.bookLoanRepository.find({
      where: {
        BookPickUpDate: Between(start, end),
        Status: In(['En progreso', 'Finalizado']),
      },
      order: { BookPickUpDate: 'ASC' },
    });

    if (prestamos.length == 0) {
      const [year, month, day] = startDate.split('-');
      const [endYear, endMonth, endDay] = endDate.split('-');

      const startDateObj = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
      );
      const endDateObj = new Date(
        parseInt(endYear),
        parseInt(endMonth) - 1,
        parseInt(endDay),
      );

      startDateObj.setHours(0, 0, 0, 0);
      endDateObj.setHours(23, 59, 59, 999);

      const startDateFormatted = startDateObj.toLocaleDateString('es-CR');
      const endDateFormatted = endDateObj.toLocaleDateString('es-CR');

      throw new NotFoundException({
        message: `No existen prestamos dentro del rango de fechas ${startDateFormatted} a ${endDateFormatted}`,
        error: 'Not Found',
      });
    }

    ReportService.registerdateHelpers();

    const templatePath = path.join(
      process.cwd(),
      'src/Reports/Templates/BLoanTemplate.hbs',
    );

    const templateHtml = fs.readFileSync(templatePath, 'utf-8');
    const template = Handlebars.compile(templateHtml);

    const htmlContent = template({
      startDate: startDate,
      endDate: endDate,
      BLoans: prestamos,
      generateDate: new Date().toLocaleString(),
    });
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent);

    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();
    return Buffer.from(pdfBuffer);
  }

  async generateCOReport(params: ReportDto): Promise<Buffer> {
    const { startDate, endDate } = params;

    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T23:59:59`);

    const cursos = await this.courseRepository
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.enrollments', 'enrollment')
      .select([
        'course.courseId',
        'course.courseName',
        'course.instructor',
        'course.location',
        'course.date',
        'course.capacity',
        'COUNT(enrollment.enrollmentId) AS enrollmentCount',
      ])
      .where('course.date BETWEEN :start AND :end', { start, end })
      .groupBy('course.courseId')
      .orderBy('course.date', 'ASC')
      .getRawMany();

    if (cursos.length == 0) {
      const [year, month, day] = startDate.split('-');
      const [endYear, endMonth, endDay] = endDate.split('-');

      const startDateObj = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
      );
      const endDateObj = new Date(
        parseInt(endYear),
        parseInt(endMonth) - 1,
        parseInt(endDay),
      );

      startDateObj.setHours(0, 0, 0, 0);
      endDateObj.setHours(23, 59, 59, 999);

      const startDateFormatted = startDateObj.toLocaleDateString('es-CR');
      const endDateFormatted = endDateObj.toLocaleDateString('es-CR');

      throw new NotFoundException({
        message: `No existen cursos dentro del rango de fechas ${startDateFormatted} a ${endDateFormatted}`,
        error: 'Not Found',
      });
    }

    const cursosConCuposRestantes = cursos.map((curso) => ({
      ...curso,
      usedSeats: curso.enrollmentCount,
    }));

    ReportService.registerdateHelpers();

    const templatePath = path.join(
      process.cwd(),
      'src/Reports/Templates/COTemplate.hbs',
    );

    const templateHtml = fs.readFileSync(templatePath, 'utf-8');
    const template = Handlebars.compile(templateHtml);

    const htmlContent = template({
      startDate: startDate,
      endDate: endDate,
      cursos: cursosConCuposRestantes,
      generateDate: new Date().toLocaleString(),
    });
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent);

    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();
    return Buffer.from(pdfBuffer);
  }

  async generateEVReport(params: ReportDto): Promise<Buffer> {
    const { startDate, endDate } = params;

    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T23:59:59`);

    const eventos = await this.eventRepository.find({
      where: {
        Date: Between(start, end),
      },
      order: { Date: 'ASC' },
    });

    if (eventos.length == 0) {
      const [year, month, day] = startDate.split('-');
      const [endYear, endMonth, endDay] = endDate.split('-');

      const startDateObj = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
      );
      const endDateObj = new Date(
        parseInt(endYear),
        parseInt(endMonth) - 1,
        parseInt(endDay),
      );

      startDateObj.setHours(0, 0, 0, 0);
      endDateObj.setHours(23, 59, 59, 999);

      const startDateFormatted = startDateObj.toLocaleDateString('es-CR');
      const endDateFormatted = endDateObj.toLocaleDateString('es-CR');

      throw new NotFoundException({
        message: `No existen eventos dentro del rango de fechas ${startDateFormatted} a ${endDateFormatted}`,
        error: 'Not Found',
      });
    }

    ReportService.registerdateHelpers();

    const templatePath = path.join(
      process.cwd(),
      'src/Reports/Templates/EVTemplate.hbs',
    );

    const templateHtml = fs.readFileSync(templatePath, 'utf-8');
    const template = Handlebars.compile(templateHtml);

    const htmlContent = template({
      startDate: startDate,
      endDate: endDate,
      eventos: eventos,
      generateDate: new Date().toLocaleString(),
    });
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent);

    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();
    return Buffer.from(pdfBuffer);
  }
}
