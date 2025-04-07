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

  async createCourse(
    createCourseDto: CreateCourseDto,
  ): Promise<{ message: string }> {
    try {
      const course = this.courseRepository.create({
        ...createCourseDto,
        programProgramsId:
          createCourseDto.programProgramsId == null ||
          createCourseDto.programProgramsId == 0
            ? null
            : createCourseDto.programProgramsId,
      });
      const savedCourse = await this.courseRepository.save(course);

      const adviceData: CreateAdviceDto = {
        reason: `Próximo curso: ${savedCourse.courseName}`,
        date: savedCourse.date,
        image: savedCourse.image,
        extraInfo: `Realizado en ${savedCourse.location}. Impartido por: ${savedCourse.instructor}. 
        ${savedCourse.materials && `Necesitaras: ${savedCourse.materials}`} `,
        category: 'Curso',
      };

      await this.adviceService.createNewAdvice(adviceData);

      return { message: 'Éxito al añadir el curso' };
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async findAllCourses(
    filter: GetCoursesDto,
  ): Promise<{ data: CoursesDTO[]; count: number }> {
    const { page = 1, limit = 10, courseName, status } = filter;
    const query = this.courseRepository
      .createQueryBuilder('courses')
      .leftJoinAndSelect('courses.program', 'program')
      .orderBy('courses.date', 'DESC');
  
    // Obtener la fecha actual y la fecha de ayer
    const now = new Date();
    const today = now.toISOString().split('T')[0]; // Solo la fecha sin la hora
    
    if (courseName) {
      query.andWhere('courses.courseName LIKE :courseName', {
        courseName: `%${courseName}%`,
      });
    }
    
    if (status) {
      if (status === 'upcoming') {
        query.andWhere('courses.date >= :today AND courses.Status = :trueStatus', {
          today,
          trueStatus: true,
        });
      } else if (status === 'past') {
        query.andWhere('courses.date < :today AND courses.Status = :trueStatus', {
          today,
          trueStatus: true,
        });
      } else if (status === 'cancelled') {
        query.andWhere('courses.Status = :falseStatus', { falseStatus: false });
      } else {
        query.andWhere('courses.Status = :status', { status });
      }
    }
  
    query.skip((page - 1) * limit).take(limit);
  
    const [courses, count] = await query.getManyAndCount();
  
    const result = await Promise.all(
      courses.map(async (course) => {
        const enrollmentCount = await this.enrollmentService.countActiveEnrollmentsByCourse(
          course.courseId,
        );
  
        const courseStartDate = new Date(course.date);
        const endDate = new Date(course.endDate);
  
        let Status: string;
        if (!course.Status) {
          Status = 'Cancelado';
        } else if (endDate && now > endDate) {
          Status = 'Cerrado';
        } else if (courseStartDate > now) {
          Status = 'Pendiente';
        } else {
          Status = 'En Curso';
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
          currentStatus: Status,
          programName: course.program?.programName || null,
          programProgramsId: course.program?.programsId || null,
          materials: course.materials,
        };
      }),
    );
  
    return { data: result, count };
  }
  

  async updateCourseById(
    courseId: number,
    data: Partial<CreateCourseDto>,
  ): Promise<{ message: string }> {
    try {
      const course = await this.courseRepository.findOne({
        where: { courseId },
      });

      if (!course) {
        throw new NotFoundException(`Curso no encontrado`);
      }

      await this.courseRepository.update(course.courseId, {
        ...data,
        programProgramsId:
          data.programProgramsId == null || data.programProgramsId == 0
            ? null
            : data.programProgramsId,
      });

      return { message: 'Éxito al editar el curso' };
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async disableCourse(courseId: number): Promise<{ message: string }> {
    const course = await this.courseRepository.findOne({ where: { courseId } });

    if (!course) {
      throw new NotFoundException(`No se encontró el curso.`);
    }
    course.Status = false;
    await this.courseRepository.save(course);
    return { message: 'Curso cancelado con éxito' };
  }

  async getActiveCourseById(courseId: number): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { courseId, Status: true },
    });

    if (!course) {
      throw new NotFoundException(
        'No se encontró el curso activo con ID ${courseId}.',
      );
    }

    return course;
  }

  async getNextCourses(
    SearchDTO: SearchDTO,
  ): Promise<{ data: NexCorusesDTO[]; count: number }> {
    const { month, type } = SearchDTO;
    const query = this.courseRepository.createQueryBuilder('courses');
  
    let data: Course[] = [];
    let count: number = 0;
  
    const currentDate = new Date();
    const threeMonthsLater = new Date();
    threeMonthsLater.setUTCMonth(currentDate.getUTCMonth() + 3);
    threeMonthsLater.setUTCDate(1); //!Los dias llegaban a no existir
  
    const formatDate = (date: Date) => date.toISOString().split('T')[0];
  
    try {
      query.andWhere('courses.date BETWEEN :today AND :threeMonthsLater', { 
        today: formatDate(currentDate), 
        threeMonthsLater: formatDate(threeMonthsLater),
      });
  
      if (month) {
        query.andWhere('MONTH(courses.date) = :month', { month });
      }
  
      if (type) {
        const escapeLike = (str: string) => str.replace(/[%_]/g, '\\$&');
        query.andWhere('courses.courseType LIKE :type', { type: `%${escapeLike(type)}%` });
      }
  
      query.andWhere('courses.Status = 1');
      query.orderBy('courses.date', 'ASC');
  
      [data, count] = (await query.getManyAndCount()) || [[], 0];
    } catch (error) {
      console.error("Error al ejecutar la consulta de cursos:", error);
      throw new InternalServerErrorException('Error al cargar los cursos');
    }
  
    const result = await Promise.all(
      data.map(async (course) => {
        try {
          const enrollmentCount =
            await this.enrollmentService.countActiveEnrollmentsByCourse(course.courseId);
  
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
        } catch (error) {
          console.error(`Error al obtener inscripciones del curso ${course.courseId}:`, error);
          return null;
        }
      }),
    );
  
    return { data: result.filter(Boolean), count };
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
