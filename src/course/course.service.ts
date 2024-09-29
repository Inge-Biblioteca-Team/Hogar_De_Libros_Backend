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
import { Programs } from 'src/programs/programs.entity';
import { GetCoursesDto } from './DTO/get.-course.dto';
import { CoursesDTO } from './DTO/CoursesDTO';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    private readonly enrollmentService: EnrollmentService,
    @InjectRepository(Programs)
    private readonly programRepository: Repository<Programs>,
  ) {}

  async createCourse(createCourseDto: CreateCourseDto): Promise<Course> {
    try {
      // Verificamos si el programa está activo
      const program = await this.programRepository.findOne({
        where: { programsId: createCourseDto.programProgramsId, status: true },
      });

      if (!program) {
        throw new Error('El programa asociado está inactivo o no existe.');
      }

      // Creamos el curso si el programa está activo
      const course = this.courseRepository.create(createCourseDto);
      const savedCourse = await this.courseRepository.save(course);
      return savedCourse;
    } catch (error) {
      console.error('Error al crear el curso:', error);
      throw new Error(
        error.message ||
          'Error al crear el curso. Por favor, inténtelo nuevamente.',
      );
    }
  }

  async findAllCourses(
    filter: GetCoursesDto,
  ): Promise<{ data: CoursesDTO[]; count: number }> {
    const { page = 1, limit = 10 } = filter;
    const query = this.courseRepository
      .createQueryBuilder('courses')
      .leftJoinAndSelect('courses.program', 'program');
    query.skip((page - 1) * limit).take(limit);

    const [courses, count] = await query.getManyAndCount();

    if (!courses || courses.length === 0) {
      throw new NotFoundException('No se encontraron cursos.');
    }

    const result = await Promise.all(
      courses.map(async (course) => {
        const enrollmentCount =
          await this.enrollmentService.countActiveEnrollmentsByCourse(
            course.courseId,
          );

        const now = new Date();
        const courseStartDate = new Date(course.date);
        const endDate = new Date(course.endDate);

        let status: string;
        if (!course.Status) {
          status = 'Cancelado';
        } else if (endDate && now > endDate) {
          status = 'Cerrado';
        } else if (courseStartDate > now) {
          status = 'Pendiente';
        } else {
          status = 'En Curso';
        }

        return {
          courseId: course.courseId,
          image: course.image,
          courseType: course.courseType,
          courseName: course.courseName,
          instructor: course.instructor,
          availableQuota: course.capacity - enrollmentCount,
          capacity: course.capacity,
          location: course.location,
          date: course.date,
          endDate: endDate,
          Status: status,
          duration: course.duration,
          courseTime: course.courseTime,
          targetAge: course.targetAge,
          programName: course.program ? course.program.programName : null,
          programProgramsId: course.program ? course.program.programsId : null,
        };
      }),
    );

    return { data: result, count };
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
    const query = this.courseRepository.createQueryBuilder('courses');

    let data: Course[];
    let count: number;

    const currentDate = new Date();
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(currentDate.getMonth() + 3);

    try {
      query
        .where('courses.date > :currentDate', { currentDate })
        .andWhere('courses.date <= :threeMonthsLater', { threeMonthsLater });

      if (month) {
        query.andWhere('MONTH(courses.date) = :month', { month });
      }
      if (type) {
        query.andWhere('courses.courseType LIKE :type', { type: `%${type}%` });
      }
      query.andWhere('courses.Status = 1');

      query.orderBy('courses.date', 'ASC');

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
          courseName: course.courseName,
          instructor: course.instructor,
          avaibleQuota: course.capacity - enrollmentCount,
          capacity: course.capacity,
          location: course.location,
          Date: course.date,
          CourseTime: course.courseTime,
          EndDate: course.endDate,
          objetiveAge: course.targetAge,
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
      .createQueryBuilder('courses')
      .innerJoin('courses.enrollments', 'enrollment')
      .where('enrollment.userCedula = :userCedula', { userCedula })
      .andWhere('courses.Status = 1')
      .andWhere('courses.date >= CURRENT_DATE')
      .andWhere('enrollment.status = :status', { status: 'Activo' })
      .skip((page - 1) * limit)
      .take(limit);

    let data: Course[];
    let count: number;
    query.andWhere('courses.Status = 1');

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
          courseName: course.courseName,
          instructor: course.instructor,
          avaibleQuota: course.capacity - enrollmentCount,
          capacity: course.capacity,
          location: course.location,
          Date: course.date,
          CourseTime: course.courseTime,
          EndDate: course.endDate,
          objetiveAge: course.targetAge,
          duration: course.duration,
        };
      }),
    );

    return { data: result, count };
  }
}
