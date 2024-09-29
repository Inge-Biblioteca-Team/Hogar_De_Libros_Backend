/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Get,
  ParseIntPipe,
  Param,
  NotFoundException,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { CreateProgramDto } from './dto/create-program.dto';
import { Programs } from './programs.entity';
import { ProgramsService } from './programs.service';
import { UpdateProgramsDto } from './DTO/update-course.dto';
import { SearchPDTO } from './DTO/SearchPDTO';
import { ProgramDTO } from './DTO/GetPDTO';
import { ProgramsNames } from './DTO/ProgramNames';

@ApiTags('Programs')
@Controller('programs')
export class ProgramsController {
  constructor(private readonly programService: ProgramsService) {}

  @Get('All')
  async getAllPrograms(
    @Query() searchDTO: SearchPDTO,
  ): Promise<{ data: ProgramDTO[]; count: number }> {
    return this.programService.getAllsPrograms(searchDTO);
  }

  @Get('Actived')
  async getActivedProgram(): Promise<ProgramsNames[]> {
    try {
      return await this.programService.getProgramsNames();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException('Programa inactivo');
    }
  }
  
  @Get(':id')
  @ApiResponse({
    status: 201,
    description: 'Se ha encontrado el programa.',
    type: Programs,
  })
  @ApiResponse({
    status: 400,
    description: 'No se ha encontrado el programa .',
  })
  async getActiveProgramById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Programs> {
    try {
      return await this.programService.getActiveProgramById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException('Programa inactivo');
    }
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Programa creado exitosamente.',
    type: Programs,
  })
  @ApiResponse({
    status: 400,
    description: 'El programa ya existe o error en los datos.',
  })
  async createProgram(
    @Body() createProgramDto: CreateProgramDto,
  ): Promise<Programs> {
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

  @Patch(':id')
  @ApiResponse({
    status: 201,
    description: 'Programa se ha actualizado exitosamente.',
    type: Programs,
  })
  @ApiResponse({ status: 400, description: 'Falta un campo .' })
  async updateProgram(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProgramDto: UpdateProgramsDto,
  ): Promise<Programs> {
    try {
      return await this.programService.updatePrograms(id, updateProgramDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException('Error al actualizar el programa.');
    }
  }

  @Patch(':id/disable')
  @ApiResponse({
    status: 201,
    description: 'Programa se ha deshabilitado exitosamente.',
    type: Programs,
  })
  @ApiResponse({
    status: 400,
    description: 'No se ha podido deshabiliatr exitosamente .',
  })
  async disableProgram(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    try {
      return await this.programService.disableProgram(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Error al deshabilitar el programa.');
    }
  }
}
