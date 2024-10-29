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
import { GetCoursesDto } from './DTO/get.-course.dto';
import { CoursesDTO } from './DTO/CoursesDTO';
import { CreateAdviceDto } from 'src/advices/dto/create-advice.dto';
import { AdvicesService } from 'src/advices/advices.service';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    private readonly enrollmentService: EnrollmentService,
    private adviceService: AdvicesService,
  ) {}

  //Post
  async createCourse(createCourseDto: CreateCourseDto): Promise<Course> {
    try {
      const course = this.courseRepository.create({
        ...createCourseDto,
        programProgramsId:
          createCourseDto.programProgramsId == 0
            ? null
            : createCourseDto.programProgramsId,
      });
      const savedCourse = await this.courseRepository.save(course);

      const adviceData: CreateAdviceDto = {
        reason: `Proximo curso: ${savedCourse.courseName}`,
        date: savedCourse.date,
        image: savedCourse.image,
        extraInfo: `Realizado en ${savedCourse.location}. Impartido por: ${savedCourse.instructor}. 
        ${savedCourse.materials && `Necesitaras: ${savedCourse.materials}`} `,
        category: 'Curso',
      };

      await this.adviceService.createNewAdvice(adviceData);
      return savedCourse;
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  //Get
  async findAllCourses(
    filter: GetCoursesDto,
  ): Promise<{ data: CoursesDTO[]; count: number }> {
    const { page = 1, limit = 10, courseName, status } = filter;
    const query = this.courseRepository
      .createQueryBuilder('courses')
      .leftJoinAndSelect('courses.program', 'program')
      .orderBy('courses.date', 'DESC');

    if (courseName) {
      query.andWhere('courses.courseName LIKE :courseName', {
        courseName: `%${courseName}%`,
      });
    }
    if (status) {
      query.andWhere('courses.Status = :status', {
        status: status,
      });
    }
    query.skip((page - 1) * limit).take(limit);

    const [courses, count] = await query.getManyAndCount();

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
          endDate: course.endDate,
          Status: course.Status,
          duration: course.duration,
          courseTime: course.courseTime,
          targetAge: course.targetAge,
          currentStatus: status,
          programName: course.program ? course.program.programName : null,
          programProgramsId: course.program ? course.program.programsId : null,
          materials: course.materials,
        };
      }),
    );

    return { data: result, count };
  }

  //patch
  async updateCourseById(
    courseId: number,
    updateCourseDto: Partial<CreateCourseDto>,
  ): Promise<Course> {
    const course = await this.courseRepository.findOne({ where: { courseId } });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found.`);
    }
    if (updateCourseDto.programProgramsId === 0) {
      updateCourseDto.programProgramsId = null;
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

  //Get a los siguientes cursos (3 proximos meses y activos)
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
          materials: course.materials,
        };
      }),
    );

    return { data: result, count };
  }

  //Get a los cursos de un usuario solamente activos y proximos
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
      .andWhere('enrollment.status = :status', { status: 'Activa' })
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
          materials: course.materials,
        };
      }),
    );

    return { data: result, count };
  }

  async CourseList(fecha: Date): Promise<CreateCourseDto[]> {
    const course = await this.courseRepository.find({
      select: ['courseId', 'courseName'],
      where: { Status: true, date: fecha },
    });

    return course;
  }

  async updateExpireCourses() {
    const currentDate = new Date();
    await this.courseRepository
      .createQueryBuilder()
      .update(Course)
      .set({ Status: false })
      .where('endDate < :currentDate', { currentDate })
      .andWhere('Status!= :status', { status: false })
      .execute();
  }
}