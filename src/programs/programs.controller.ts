import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { CreateProgramDto } from './dto/create-program.dto';
import { Programs } from './programs.entity';
import { ProgramsService } from './programs.service';


@ApiTags('Programs')
@Controller('programs')
export class ProgramsController {
  constructor(
    private readonly programService: ProgramsService
) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Programa creado exitosamente.', type: Programs })
  @ApiResponse({ status: 400, description: 'El programa ya existe o error en los datos.' })
  async createProgram(@Body() createProgramDto: CreateProgramDto): Promise<Programs> {
    try {
      return await this.programService.createProgramns(createProgramDto);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
        throw new BadRequestException('El programa ya existe.');
      } else {
        throw new BadRequestException('Error al crear el programa.');
      }
    }
  }
}
