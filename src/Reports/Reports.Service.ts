/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
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
      function (date: Date, format: string) {
        const options: Intl.DateTimeFormatOptions = {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        };

        if (format === 'date') {
          return date.toLocaleDateString('es-ES', options);
        } else if (format === 'datetime') {
          return date.toLocaleString('es-ES', options);
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

      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
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
    const browser = await puppeteer.launch();
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
    const browser = await puppeteer.launch();
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
    const browser = await puppeteer.launch();
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
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);

    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();
    return Buffer.from(pdfBuffer);
  }
}
