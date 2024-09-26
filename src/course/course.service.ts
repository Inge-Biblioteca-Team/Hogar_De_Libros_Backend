/* eslint-disable prettier/prettier */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';
import { CreateCourseDto } from './DTO/create-course.dto';
import { NexCorusesDTO } from './DTO/NexCoursesDTO';
import { SearchDTO } from './DTO/SearchDTO';
import { EnrollmentService } from 'src/enrollment/enrollment.service';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    private readonly enrollmentService: EnrollmentService,
  ) {}

  async createCourse(createCourseDto: CreateCourseDto): Promise<Course> {
    const course = this.courseRepository.create(createCourseDto);
    const savedCourse = await this.courseRepository.save(course);
    return savedCourse;
  }

  async findAllCourses(
    page: number,
    limit: number,
  ): Promise<{ data: Course[]; count: number }> {
    const [courses, count] = await this.courseRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    if (!courses || courses.length === 0) {
      throw new NotFoundException('No se encontraron cursos.');
    }

    return { data: courses, count };
  }

  async updateCourseById(
    courseId: number,
    updateCourseDto: Partial<CreateCourseDto>,
  ): Promise<Course> {
    const course = await this.courseRepository.findOne({ where: { courseId } });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found.`);
    }

    Object.assign(course, updateCourseDto);

    return await this.courseRepository.save(course);
  }

  async disableCourse(courseId: number): Promise<Course> {
    // Buscar el curso por su ID
    const course = await this.courseRepository.findOne({ where: { courseId } });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found.`);
    }

    // Cambiar el estado a "false" (deshabilitado)
    course.Status = false;

    // Guardar el curso actualizado
    return await this.courseRepository.save(course);
  }

  async getActiveCourseById(courseId: number): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { courseId, Status: true }, // Solo cursos activos
    });

    if (!course) {
      throw new NotFoundException(
        `Active course with ID ${courseId} not found.`,
      );
    }

    return course;
  }

  async getNextCourses(
    SearchDTO: SearchDTO,
  ): Promise<{ data: NexCorusesDTO[]; count: number }> {
    const { month, type } = SearchDTO;
    const query = this.courseRepository.createQueryBuilder('course');

    let data: Course[];
    let count: number;

    const currentDate = new Date();
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(currentDate.getMonth() + 3);

    try {
      query
        .where('course.date > :currentDate', { currentDate })
        .andWhere('course.date <= :threeMonthsLater', { threeMonthsLater });

      if (month) {
        query.andWhere('MONTH(course.date) = :month', { month });
      }
      if (type) {
        query.andWhere('course.courseType LIKE :type', { type: `%${type}%` });
      }

      query.orderBy('course.date', 'ASC');

      [data, count] = await query.getManyAndCount();
    } catch (error) {
      throw new InternalServerErrorException('Error al cargar los cursos');
    }

    const result = await Promise.all(
      data.map(async (course) => {
        const enrollmentCount =
          await this.enrollmentService.countActiveEnrollmentsByCourse(
            course.courseId,
          );

        return {
          Id: course.courseId,
          image: course.image,
          courseType: course.courseType,
          instructor: course.instructor,
          avaibleQuota: course.capacity - enrollmentCount,
          capacity: course.capacity,
          location: course.location,
          Date: course.date,
          CourseTime: course.courseTime,
          EndDate: course.endDate,
          objetiveAge: course.targetAge,
          status: 'Pendiente',
          duration: course.duration,
        };
      }),
    );

    return { data: result, count };
  }

  async getCoursesByUserCedula(
    searchDTO: SearchDTO,
  ): Promise<{ data: NexCorusesDTO[]; count: number }> {
    const { userCedula, page = 1, limit = 10 } = searchDTO;

    const query = this.courseRepository
      .createQueryBuilder('course')
      .innerJoin('course.enrollments', 'enrollment')
      .where('enrollment.userCedula = :userCedula', { userCedula })
      .andWhere('course.date >= CURRENT_DATE')
      .andWhere('enrollment.status = :status', { status: 'Activo' })
      .skip((page - 1) * limit)
      .take(limit);

    let data: Course[];
    let count: number;

    try {
      [data, count] = await query
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();
    } catch (error) {
      throw new InternalServerErrorException('Error Al cargar los cursos');
    }
    const result = await Promise.all(
      data.map(async (course) => {
        const enrollmentCount =
          await this.enrollmentService.countActiveEnrollmentsByCourse(
            course.courseId,
          );

        return {
          Id: course.courseId,
          image: course.image,
          courseType: course.courseType,
          instructor: course.instructor,
          avaibleQuota: course.capacity - enrollmentCount,
          capacity: course.capacity,
          location: course.location,
          Date: course.date,
          CourseTime: course.courseTime,
          EndDate: course.endDate,
          objetiveAge: course.targetAge,
          status: 'Pendiente',
          duration: course.duration,
        };
      }),
    );

    return { data: result, count };
  }
}
