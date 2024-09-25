import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Programs } from './programs.entity';
import { CreateProgramDto } from './dto/create-program.dto';

@Injectable()
export class ProgramsService {
  constructor(
    @InjectRepository(Programs)
    private readonly programsRepository: Repository<Programs>,
  ) {}

  async createProgramns(createProgramDto: CreateProgramDto): Promise<Programs> {
    try {
     
      const program = this.programsRepository.create(createProgramDto);
      
      
      return await this.programsRepository.save(program);
    }catch (error) {
            if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {  
              throw new BadRequestException('El programa ya existe.');
            }
            throw new BadRequestException('Error al crear el programa.');
    }
  }
}
