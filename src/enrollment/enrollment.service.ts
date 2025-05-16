/* eslint-disable prettier/prettier */
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from './enrollment.entity';
import { Course } from '../course/course.entity';
import { User } from 'src/user/user.entity';
import { CreateEnrollmentDto } from './DTO/create-enrollment.dto';
import { PaginationEnrollmentListDto } from './DTO/pagination-enrollmentList.dto';
import { GetEnrollmentsDTO } from './DTO/GetDTO';
import * as path from 'path';
import * as fs from 'fs';
import * as Handlebars from 'handlebars';
import { MailsService } from 'src/mails/mails.service';
import { chromium } from 'playwright';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private mailService: MailsService,
  ) {}

  //Post
  async enrollUser(
    Data: CreateEnrollmentDto,
    courseId: number,
  ): Promise<{ message: string }> {
    try {
      const course = await this.courseRepository.findOne({
        where: { courseId },
      });

      const activeEnrollmentsCount =
        await this.countActiveEnrollmentsByCourse(courseId);
      if (activeEnrollmentsCount >= course.capacity) {
        throw new ConflictException(
          'El curso ya ha alcanzado su capacidad máxima',
        );
      }

      if (Data.userCedula) {
        const existingEnrollment = await this.enrollmentRepository.findOne({
          where: {
            course: { courseId },
            userCedula: Data.userCedula,
          },
        });

        if (existingEnrollment) {
          throw new ConflictException(
            'El usuario ya está inscrito en este curso',
          );
        }
      }

      const enrollment = this.enrollmentRepository.create({
        ...Data,
        courseId: courseId,
      });

      await this.enrollmentRepository.save(enrollment);
      await this.mailService.enrollmentConfirm(enrollment.enrollmentId);

      return { message: 'Matrícula registrada con éxito' };
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  //Funcion de Apoyo
  async findEnrollment(
    userCedula: string,
    courseId: number,
  ): Promise<Enrollment | null> {
    return this.enrollmentRepository.findOne({
      where: {
        userCedula: userCedula,
        courseId: courseId,
      },
    });
  }

  //Patch Cancel
  async cancelEnrollment(
    CourseID: number,
    UserCedula: string,
  ): Promise<{ message: string }> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: {
        course: { courseId: CourseID },
        userCedula: UserCedula,
      },
      relations: ['course'],
    });

    if (!enrollment) {
      throw new NotFoundException('No existe la matrícula');
    }

    const courseDate = enrollment.course.date;
    const courseTime = enrollment.course.courseTime;

    const courseStartDate = new Date(
      `${courseDate.toString().split('T')[0]}T${courseTime}`,
    );
    const currentDate = new Date();

    const hoursDifference =
      (courseStartDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60);

    if (hoursDifference < 72) {
      throw new ForbiddenException(
        'No se puede cancelar la matrícula menos de 72 horas antes del curso',
      );
    }

    enrollment.status = 'Cancelado';

    try {
      await this.enrollmentRepository.save(enrollment);
      await this.mailService.enrollmentCancel(enrollment.enrollmentId);
      return { message: 'Matrícula cancelada con éxito' };
    } catch (error) {
      throw new InternalServerErrorException('Error al cancelar la matrícula');
    }
  }

  //Funcion de Apoyo(Revisa cuantas matriculas tiene un curso y retorna el numero)
  async countActiveEnrollmentsByCourse(
    courseId: number,
    status: string = 'Activa',
  ): Promise<number> {
    const result = await this.enrollmentRepository
      .createQueryBuilder('enrollment')
      .select('COUNT(enrollment.enrollmentId)', 'enrollmentCount')
      .where('enrollment.courseId = :courseId', { courseId })
      .andWhere('enrollment.status = :status', { status })
      .getRawOne();

    return result.enrollmentCount ? parseInt(result.enrollmentCount, 10) : 0;
  }

  //Matricula por curso paginada de 5 fijo
  async getEnrollmentsListByIdCourse(
    paginationEnrollmentListDTO: PaginationEnrollmentListDto,
  ): Promise<{ data: GetEnrollmentsDTO[]; count: number }> {
    const { courseId, page = 1 } = paginationEnrollmentListDTO;
    const limit = 5;
    const [result, total] = await this.enrollmentRepository
      .createQueryBuilder('enrollment')
      .where('enrollment.courseId = :courseId', { courseId })
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: result.map((enrollment) => ({
        enrollmentId: enrollment.enrollmentId,
        userCedula: enrollment.userCedula,
        enrollmentDate: enrollment.enrollmentDate,
        UserName: enrollment.UserName,
        direction: enrollment.direction,
        phone: enrollment.phone,
        ePhone: enrollment.ePhone,
        email: enrollment.email,
      })),
      count: total,
    };
  }

  async saveEnrollmentList(courseID: number) {
    const data = await this.courseRepository.findOne({
      where: { courseId: courseID, enrollments: { status: 'Activa' } },
      relations: ['enrollments'],
    });

    const templatePath = path.join(
      __dirname,
      'Templates',
      'EnrollmentsListTemplate.hbs',
    );

    const templateHtml = fs.readFileSync(templatePath, 'utf-8');
    const template = Handlebars.compile(templateHtml);
    const baseUrl = process.env.BASE_URL;

    Handlebars.registerHelper('addOne', function (value) {
      return value + 1;
    });

    const htmlContent = template({
      course: data,
      baseUrl,
    });

    const browser = await chromium.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle' });
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '10mm', bottom: '10mm' },
    });

    await browser.close();
    return Buffer.from(pdfBuffer);
  }
}
