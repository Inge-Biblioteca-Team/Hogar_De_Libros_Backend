/* eslint-disable prettier/prettier */
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Programs } from './programs.entity';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramsDto } from './DTO/update-course.dto';
import { SearchPDTO } from './DTO/SearchPDTO';
import { ProgramDTO } from './DTO/GetPDTO';
import { ProgramsNames } from './DTO/ProgramNames';
import { Course } from 'src/course/course.entity';

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
  async createProgramns(createProgramDto: CreateProgramDto): Promise<Programs> {
    try {
      const program = this.programsRepository.create(createProgramDto);

      return await this.programsRepository.save(program);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
        throw new BadRequestException('El programa ya existe.');
      }

      // Registrar otros errores para propósitos de depuración (opcional)
      console.error('Error al crear el programa:', error);
      throw new BadRequestException('Error al crear el programa.');
    }
  }

  async updatePrograms(
    id: number,
    updateProgramDto: UpdateProgramsDto,
  ): Promise<Programs> {
    try {
      const program = await this.programsRepository.findOne({
        where: { programsId: id },
      });

      if (!program) {
        throw new NotFoundException(`El programa con ID ${id} no existe.`);
      }

      Object.assign(program, updateProgramDto);

      return await this.programsRepository.save(program);
    } catch (error) {
      throw new BadRequestException('Error al actualizar el programa.');
    }
  }

  async disableProgram(id: number): Promise<{ message: string }> {
    try {
      const program = await this.programsRepository.findOne({
        where: { programsId: id },
      });

      if (!program) {
        throw new NotFoundException(`El programa con ID ${id} no existe.`);
      }

      if (program.status === false) {
        throw new BadRequestException(
          `El programa con ID ${id} ya está deshabilitado.`,
        );
      }

      program.status = false;

      await this.programsRepository.save(program);

      return {
        message: `El programa con ID ${id} ha sido deshabilitado correctamente.`,
      };
    } catch (error) {
      throw new BadRequestException('Error al deshabilitar el programa.');
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
      throw new NotFoundException(`No existen actividades relacionadas al programa.`);
    }
    return program.courses;
  }
}
