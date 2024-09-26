/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Programs } from './programs.entity';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramsDto } from './DTO/update-course.dto';

@Injectable()
export class ProgramsService {
  constructor(
    @InjectRepository(Programs)
    private readonly programsRepository: Repository<Programs>,
  ) {}

  async getActiveProgramById(id: number): Promise<Programs> {
    try {
      
      const program = await this.programsRepository.findOne({
        where: { programsId: id, status: true },
        relations: ['courses'],
      });

      if (!program) {
        throw new NotFoundException(`El programa activo con el ID ${id} no existe o está deshabilitado.`);
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
    }catch (error) {
            if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {  
              throw new BadRequestException('El programa ya existe.');
            }

            // Registrar otros errores para propósitos de depuración (opcional)
    console.error('Error al crear el programa:', error);
            throw new BadRequestException('Error al crear el programa.');
    }
  }

  async updatePrograms(id: number, updateProgramDto: UpdateProgramsDto): Promise<Programs> {
    try {
      const program = await this.programsRepository.findOne({ where: { programsId: id } });

      if (!program) {
        throw new NotFoundException(`El programa con ID ${id} no existe.`);
      }

      // Actualizamos solo los campos que vengan en el DTO
      Object.assign(program, updateProgramDto);

      return await this.programsRepository.save(program);
    } catch (error) {
      throw new BadRequestException('Error al actualizar el programa.');
    }
  }

  async disableProgram(id: number): Promise<{ message: string }> {
    try {
    
      const program = await this.programsRepository.findOne({ where: { programsId: id } });

      if (!program) {
        throw new NotFoundException(`El programa con ID ${id} no existe.`);
      }

      if (program.status === false) {
        throw new BadRequestException(`El programa con ID ${id} ya está deshabilitado.`);
      }

    
      program.status = false;

      await this.programsRepository.save(program);

      return { message: `El programa con ID ${id} ha sido deshabilitado correctamente.` };
    } catch (error) {
      throw new BadRequestException('Error al deshabilitar el programa.');
    }
  }

}
