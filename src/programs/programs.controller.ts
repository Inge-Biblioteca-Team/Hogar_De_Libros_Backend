/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Body,
  Get,
  ParseIntPipe,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags} from '@nestjs/swagger';
import { CreateProgramDto } from './dto/create-program.dto';
import { Programs } from './programs.entity';
import { ProgramsService } from './programs.service';
import { UpdateProgramsDto } from './DTO/update-course.dto';
import { SearchPDTO } from './DTO/SearchPDTO';
import { ProgramDTO } from './DTO/GetPDTO';
import { ProgramsNames } from './DTO/ProgramNames';
import { Course } from 'src/course/course.entity';
import { activities } from './DTO/Programs-Activities.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { ActivitiesFilterDTO } from './DTO/ActivitiesFilter.dto';

@ApiTags('Programs')
@Controller('programs')
export class ProgramsController {
  constructor(private readonly programService: ProgramsService) {}

  @Get('Activities')
  @UseGuards(AuthGuard)
  async getActivities(
    @Query() filters: SearchPDTO,
  ): Promise<{ data: activities[]; count: number }> {
    return this.programService.getActivities(filters);
  }

  @Get('All')
  async getAllPrograms(
    @Query() searchDTO: SearchPDTO,
  ): Promise<{ data: ProgramDTO[]; count: number }> {
    return this.programService.getAllsPrograms(searchDTO);
  }

  @Get('Program/Activities')
  async getActivitiesByPrograms(
    @Query() filters:ActivitiesFilterDTO ,
  ): Promise<{ data: activities[]; count: number }> {
    return this.programService.getActivities(filters);
  }

  @Get('Program/:id/Related')
  async getRelatedPrograms(
    @Param('id') id:number
  ): Promise<{ data: activities[]; count: number }> {
    return this.programService.getRelatedByProgram(id);
  }

  @Get('Actived')
  async getActivedProgram(): Promise<ProgramsNames[]> {
    return await this.programService.getProgramsNames();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getActiveProgramById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Programs> {
    return await this.programService.getActiveProgramById(id);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'asistente')
  async createProgram(
    @Body() createProgramDto: CreateProgramDto,
  ): Promise<{message : string}> {
    return await this.programService.createProgramns(createProgramDto);
  }
 
  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async updateProgram(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProgramDto: UpdateProgramsDto,
  ): Promise<{message : string}> {
    return await this.programService.updatePrograms(id, updateProgramDto);
  }

  @Patch(':id/disable')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async disableProgram(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return await this.programService.disableProgram(id);
  }

  @Get(':id/courses')
  @UseGuards(AuthGuard)
  async getCoursesByProgram(@Param('id') id: number): Promise<Course[]> {
    return await this.programService.getCoursesByProgram(id);
  }
}
