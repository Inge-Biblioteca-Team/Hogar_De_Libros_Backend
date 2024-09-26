/* eslint-disable prettier/prettier */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from './enrollment.entity';
import { Course } from '../course/course.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async enrollUser(courseId: number, userCedula: string): Promise<Enrollment> {
    // Buscar el curso por ID
    const course = await this.courseRepository.findOne({ where: { courseId } });
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    // Buscar al usuario por cédula
    let user = await this.userRepository.findOne({
      where: { cedula: userCedula },
    });

    if (course.capacity <= 0) {
      throw new BadRequestException('No hay cupos disponibles para este curso');
    }

    if (!user) {
      user = this.userRepository.create({ cedula: userCedula });
      user = await this.userRepository.save(user);
    }

    const enrollment = this.enrollmentRepository.create({
      course,
      user,
    });

    const savedEnrollment = await this.enrollmentRepository.save(enrollment);

    course.capacity -= 1;
    await this.courseRepository.save(course);

    return savedEnrollment;
  }

  async cancelEnrollment(
    CourseID: number,
    UserCedula: string,
  ): Promise<{ message: string }> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: {
        user: { cedula: UserCedula },
        course: { courseId: CourseID },
      },
      relations: ['user', 'course'],
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
      return { message: 'Matrícula cancelada con éxito' };
    } catch (error) {
      throw new InternalServerErrorException('Error al cancelar la matrícula');
    }
  }

  async countActiveEnrollmentsByCourse(
    courseId: number,
    status: string = 'Activo',
  ): Promise<number> {
    const result = await this.enrollmentRepository
      .createQueryBuilder('enrollment')
      .select('COUNT(enrollment.enrollmentId)', 'enrollmentCount')
      .where('enrollment.courseId = :courseId', { courseId })
      .andWhere('enrollment.status = :status', { status })
      .getRawOne();

    return result.enrollmentCount ? parseInt(result.enrollmentCount, 10) : 0;
  }
}
