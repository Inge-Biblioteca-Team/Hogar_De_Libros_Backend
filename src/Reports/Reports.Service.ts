/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { ReportDto } from './DTO';
import * as path from 'path';
import * as fs from 'fs';
import * as Handlebars from 'handlebars';
import { InjectRepository } from '@nestjs/typeorm';
import { ComputerLoan } from 'src/computer-loan/computer-loan.entity';
import { Between, In, Repository } from 'typeorm';
import { BookLoan } from 'src/book-loan/book-loan.entity';
import { Course } from 'src/course/course.entity';
import { events } from 'src/events/events.entity';
import { format } from '@formkit/tempo';
import { Attendance } from 'src/attendance/attendance.type';
import { Role, User } from 'src/user/user.entity';

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

    @InjectRepository(Attendance)
    private attendanceRepo: Repository<Attendance>,

    @InjectRepository(User)
    private usersRepo: Repository<User>,
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

      return format(dateStr, 'DD/MM/YYYY', 'es');
    });
  }

  static registerBirthHelpers() {
    Handlebars.registerHelper('FbirthDate', function (dateStr: string) {
      if (!dateStr) return '';

      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;

      return format(dateStr, 'MMMM DD', 'es');
    });
  }

  static registerGenderHelper() {
    Handlebars.registerHelper('gender', (gender: string) => {
      return gender === 'M' ? 'Masculino' : 'Femenino';
    });
  }

  static registerIncHelper() {
    Handlebars.registerHelper('inc', function (value: number) {
      return value + 1;
    });
  }

  static registerTargetAgeHelper() {
    Handlebars.registerHelper('ageRange', function (value: number) {
      switch (value) {
        case 1:
          return 'Todo Público';
        case 2:
          return 'Niños 0-5 años';
        case 11:
          return 'Niños mayores a 6 años';
        case 24:
          return 'Jóvenes';
        case 59:
          return 'Adultos';
        case 60:
          return 'Adultos Mayores';
        default:
          return 'Desconocido';
      }
    });
  }

  //*Busqueda y armado de datos para el reporte de Asistencia
  async generateATTReport(params: ReportDto): Promise<Buffer> {
    const puppeteer = await import('puppeteer');
    const baseUrl = process.env.BASE_URL;
    const { startDate, endDate } = params;

    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T23:59:59`);

    const asistencias = await this.attendanceRepo.find({
      where: {
        date: Between(start, end),
      },
      order: { date: 'ASC' },
    });

    const grouped = asistencias.reduce((acc, asistencia) => {
      const age = asistencia.age;
      const gender = asistencia.gender;

      let ageGroup = acc.find((group) => group.edad === age);

      if (!ageGroup) {
        ageGroup = { edad: age, total: 0, M: 0, F: 0 };
        acc.push(ageGroup);
      }
      ageGroup.total++;

      if (gender === 'M') ageGroup.M++;
      if (gender === 'F') ageGroup.F++;

      return acc;
    }, []);

    const total = grouped.reduce(
      (acc, group) => {
        acc.total += group.total;
        acc.M += group.M;
        acc.F += group.F;
        return acc;
      },
      { total: 0, M: 0, F: 0 },
    );

    if (asistencias.length == 0) {
      const startDateObj = format(start, 'DD/MM/YYYY', 'es');
      const endDateObj = format(end, 'DD/MM/YYYY', 'es');

      throw new NotFoundException({
        message: `No existen asistencias dentro del rango de fechas ${startDateObj} a ${endDateObj}`,
        error: 'Not Found',
      });
    }

    ReportService.registerdateHelpers();
    ReportService.registerGenderHelper();

    const templatePath = path.join(
      process.cwd(),
      'src/Reports/Templates/AttendanceTemplate.hbs',
    );

    const templateHtml = fs.readFileSync(templatePath, 'utf-8');
    const template = Handlebars.compile(templateHtml);

    const htmlContent = template({
      startDate: startDate,
      endDate: endDate,
      Asistencias: asistencias,
      generateDate: new Date().toLocaleString(),
      baseUrl: baseUrl,
      stats: { grouped, total },
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

  //*Reportes para prestamos de libros(Info de los prestamos y conteo total)
  async generateBLoans(params: ReportDto): Promise<Buffer> {
    const puppeteer = await import('puppeteer');
    const baseUrl = process.env.BASE_URL;
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
      const startDateObj = format(start, 'DD/MM/YYYY', 'es');
      const endDateObj = format(end, 'DD/MM/YYYY', 'es');

      throw new NotFoundException({
        message: `No existen prestamos dentro del rango de fechas ${startDateObj} a ${endDateObj}`,
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
      baseUrl: baseUrl,
      total: prestamos.length,
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

  //*Reportes para cursos falta desglose de asistencia por edades
  async generateCOReport(params: ReportDto): Promise<Buffer> {
    const puppeteer = await import('puppeteer');
    const { startDate, endDate } = params;
    const baseUrl = process.env.BASE_URL;

    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T23:59:59`);

    const cursos = await this.courseRepository
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.enrollments', 'enrollment')
      .where('course.date BETWEEN :start AND :end', { start, end })
      .orderBy('course.date', 'ASC')
      .addOrderBy('course.targetAge', 'ASC')
      .getMany();

    if (cursos.length == 0) {
      const startDateObj = format(start, 'DD/MM/YYYY', 'es');
      const endDateObj = format(end, 'DD/MM/YYYY', 'es');

      throw new NotFoundException({
        message: `No existen cursos dentro del rango de fechas ${startDateObj} a ${endDateObj}`,
        error: 'Not Found',
      });
    }

    ReportService.registerdateHelpers();
    ReportService.registerIncHelper();
    ReportService.registerTargetAgeHelper();

    const templatePath = path.join(
      process.cwd(),
      'src/Reports/Templates/COTemplate.hbs',
    );

    const templateHtml = fs.readFileSync(templatePath, 'utf-8');
    const template = Handlebars.compile(templateHtml);

    const htmlContent = template({
      startDate: startDate,
      endDate: endDate,
      cursos: cursos,
      generateDate: new Date().toLocaleString(),
      baseUrl: baseUrl,
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

  //*Reportes sobre eventos falta desglose por edades
  async generateEVReport(params: ReportDto): Promise<Buffer> {
    const puppeteer = await import('puppeteer');
    const { startDate, endDate } = params;
    const baseUrl = process.env.BASE_URL;

    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T23:59:59`);

    const eventos = await this.eventRepository.find({
      where: {
        Date: Between(start, end),
      },
      order: { Date: 'ASC' },
    });

    const groupedEvents = eventos.reduce(
      (acc, event) => {
        const key = event.TargetAudience;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(event);
        return acc;
      },
      {} as Record<string, typeof eventos>,
    );

    if (eventos.length == 0) {
      const startDateObj = format(start, 'DD/MM/YYYY', 'es');
      const endDateObj = format(end, 'DD/MM/YYYY', 'es');

      throw new NotFoundException({
        message: `No existen eventos dentro del rango de fechas ${startDateObj} a ${endDateObj}`,
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
      eventos: groupedEvents,
      generateDate: new Date().toLocaleString(),
      baseUrl: baseUrl,
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

  async generateUSReport(params: ReportDto): Promise<Buffer> {
    const puppeteer = await import('puppeteer');
    const { startDate, endDate } = params;

    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T23:59:59`);

    const Users = await this.usersRepo.find({
      where: {
        registerDate: Between(start, end),
        status: true,
        role: Role.ExternalUser,
      },
      order: { registerDate: 'ASC' },
    });

    if (Users.length == 0) {
      const startDateObj = format(start, 'DD/MM/YYYY', 'es');
      const endDateObj = format(end, 'DD/MM/YYYY', 'es');

      throw new NotFoundException({
        message: `Ningún usuario se registró entre el ${startDateObj} y el ${endDateObj}`,
        error: 'Not Found',
      });
    }
    ReportService.registerHelpers();
    ReportService.registerdateHelpers();
    ReportService.registerBirthHelpers();
    ReportService.registerIncHelper();

    const templatePath = path.join(
      process.cwd(),
      'src/Reports/Templates/UserReport.hbs',
    );

    const templateHtml = fs.readFileSync(templatePath, 'utf-8');
    const template = Handlebars.compile(templateHtml);
    const baseUrl = process.env.BASE_URL;
    const htmlContent = template({
      startDate: startDate,
      endDate: endDate,
      generateDate: new Date().toLocaleString(),
      users: Users,
      baseUrl: baseUrl,
    });
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent);

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '10mm', bottom: '10mm' },
    });
    await browser.close();
    return Buffer.from(pdfBuffer);
  }

  //*Reporte de prestamos de computadoras( Especifico y con total al final del documento)
  async generateWSLoans(params: ReportDto): Promise<Buffer> {
    const puppeteer = await import('puppeteer');
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
      const startDateObj = format(start, 'DD/MM/YYYY', 'es');
      const endDateObj = format(end, 'DD/MM/YYYY', 'es');

      throw new NotFoundException({
        message: `No existen prestamos dentro del rango de fechas ${startDateObj} a ${endDateObj}`,
        error: 'Not Found',
      });
    }

    ReportService.registerHelpers();
    ReportService.registerdateHelpers();

    const templatePath = path.join(
      process.cwd(),
      'src/Reports/Templates/WSLoanTemplate.hbs',
    );

    const templateHtml = fs.readFileSync(templatePath, 'utf-8');
    const template = Handlebars.compile(templateHtml);
    const baseUrl = process.env.BASE_URL;

    const htmlContent = template({
      startDate: startDate,
      endDate: endDate,
      WSLoans: prestamos,
      generateDate: new Date().toLocaleString(),
      total: prestamos.length,
      baseUrl: baseUrl,
    });
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent);

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '10mm', bottom: '10mm' },
    });
    await browser.close();
    return Buffer.from(pdfBuffer);
  }
}
