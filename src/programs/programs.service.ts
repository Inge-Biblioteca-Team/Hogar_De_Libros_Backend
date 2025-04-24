/* eslint-disable prettier/prettier */
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Programs } from './programs.entity';
import { CreateProgramDto } from './DTO/create-program.dto';
import { UpdateProgramsDto } from './DTO/update-course.dto';
import { SearchPDTO } from './DTO/SearchPDTO';
import { ProgramDTO } from './DTO/GetPDTO';
import { ProgramsNames } from './DTO/ProgramNames';
import { Course } from 'src/course/course.entity';
import { activities } from './DTO/Programs-Activities.dto';
import { ActivitiesFilterDTO } from './DTO/ActivitiesFilter.dto';

@Injectable()
export class ProgramsService {
  constructor(
    @InjectRepository(Programs)
    private readonly programsRepository: Repository<Programs>,
  ) {}

  async getAllsPrograms(
    SearchDTO: SearchPDTO,
  ): Promise<{ data: ProgramDTO[]; count: number }> {
    const { page = 1, limit = 5, programName, status } = SearchDTO;
    const query = this.programsRepository
      .createQueryBuilder('programs')
      .orderBy('programsId', 'DESC');

    if (programName) {
      query.andWhere('programs.programName LIKE :programName', {
        programName: `%${programName}%`,
      });
    }

    if (status) {
      query.andWhere('programs.status = :status', { status });
    }
    query.skip((page - 1) * limit).take(limit);

    const [data, count] = await query.getManyAndCount();

    const result = data.map((program) => {
      return {
        programsId: program.programsId,
        programName: program.programName,
        description: program.description,
        image: program.image,
        status: program.status,
      } as ProgramDTO;
    });

    return { data: result, count };
  }

  async getActiveProgramById(id: number): Promise<Programs> {
    try {
      const program = await this.programsRepository.findOne({
        where: { programsId: id, status: true },
        relations: ['courses'],
      });

      if (!program) {
        throw new NotFoundException(
          `El programa activo con el ID ${id} no existe o está deshabilitado.`,
        );
      }

      return program;
    } catch (error) {
      throw new BadRequestException('Error al obtener el programa.');
    }
  }

  async createProgramns(
    createProgramDto: CreateProgramDto,
  ): Promise<{ message: string }> {
    try {
      const program = this.programsRepository.create(createProgramDto);

      await this.programsRepository.save(program);
      return { message: 'Programa creado correctamente.' };
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async updatePrograms(
    id: number,
    updateProgramDto: UpdateProgramsDto,
  ): Promise<{ message: string }> {
    try {
      const program = await this.programsRepository.findOne({
        where: { programsId: id },
      });

      if (!program) {
        throw new NotFoundException({
          message: `El programa con ID ${id} no existe.`,
        });
      }

      Object.assign(program, updateProgramDto);

      await this.programsRepository.save(program);
      return { message: `El programa con ID ${id} ha sido actualizado.` };
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async disableProgram(id: number): Promise<{ message: string }> {
    try {
      const program = await this.programsRepository.findOne({
        where: { programsId: id },
      });

      if (!program) {
        throw new NotFoundException({
          message: `El programa con ID ${id} no existe.`,
        });
      }

      if (program.status === false) {
        throw new BadRequestException({
          message: `El programa con ID ${id} ya está deshabilitado.`,
        });
      }

      program.status = false;

      await this.programsRepository.save(program);

      return {
        message: `El programa con ID ${id} ha sido deshabilitado correctamente.`,
      };
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al deshabilitar el programa.';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async getProgramsNames(): Promise<ProgramsNames[]> {
    const query = this.programsRepository.createQueryBuilder('programs');
    query.andWhere('programs.status = 1');

    const data = await query.getMany();

    const result = data.map((program) => {
      return {
        programsId: program.programsId,
        programName: program.programName,
      } as ProgramsNames;
    });

    return result;
  }

  async getCoursesByProgram(id: number): Promise<Course[]> {
    const program = await this.programsRepository
      .createQueryBuilder('program')
      .leftJoinAndSelect('program.courses', 'course')
      .where('program.programsId = :id', { id })
      .andWhere('course.Status = :status', { status: 1 })
      .getOne();

    if (!program) {
      throw new NotFoundException(
        `No existen actividades relacionadas al programa.`,
      );
    }
    return program.courses;
  }

  //El admin debe poder ver todas las actividades
  async getRelatedByProgram(id: number): Promise<{
    data: activities[];
    count: number;
  }> {
    const query = this.programsRepository
      .createQueryBuilder('program')
      .andWhere('program.programsId = :programsId', { programsId: id })
      .leftJoinAndSelect('program.events', 'events')
      .leftJoinAndSelect('program.courses', 'course')
      .orderBy('program.programsId', 'ASC');

    const [programData] = await query.getManyAndCount();

    const activities: activities[] = programData.flatMap((program) => [
      ...program.courses.map((course) => ({
        activitieID: 'C' + course.courseId,
        programName: program.programName,
        activitieName: course.courseName,
        description: course.courseType,
        activitiDate: course.date,
        image: course.image,
        activityType: 'Curso',
      })),
      ...program.events.map((event) => ({
        activitieID: 'E' + event.EventId,
        programName: program.programName,
        activitieName: event.Title,
        description: event.Details,
        activitiDate: event.Date,
        image: event.Image,
        activityType: 'Evento',
      })),
    ]);

    return { data: activities, count: activities.length };
  }

  async getActivities(
    filters: ActivitiesFilterDTO,
  ): Promise<{ data: activities[]; count: number }> {
    const { month, programID } = filters;
    const currentDate = new Date();

    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(currentDate.getMonth() + 3);

    const query = this.programsRepository
      .createQueryBuilder('program')
      .leftJoinAndSelect('program.courses', 'course')
      .where('course.date > :currentDate', { currentDate })
      .andWhere('course.date <= :threeMonthsLater', { threeMonthsLater })
      .andWhere('course.Status = :status', { status: 1 })
      .leftJoinAndSelect('program.events', 'events')
     

    if (programID) {
      query.andWhere('program.programsId = :programsId', {
        programsId: programID,
      });
    }
    if (month) {
      query.andWhere('MONTH(course.date) = :month', { month });
    }
    const [programData] = await query.getManyAndCount();

    const activities: activities[] = programData.flatMap((program) => [
      ...program.courses.map((course) => ({
        activitieID: 'C' + course.courseId,
        programName: program.programName,
        activitieName: course.courseName,
        description: course.courseType,
        activitiDate: course.date,
        image: course.image,
        activityType: 'Curso',
      })),
      ...program.events.map((event) => ({
        activitieID: 'E' + event.EventId,
        programName: program.programName,
        activitieName: event.Title,
        description: event.Details,
        activitiDate: event.Date,
        image: event.Image,
        activityType: 'Evento',
      })),
    ]);

    return { data: activities, count: activities.length };
  }
}
