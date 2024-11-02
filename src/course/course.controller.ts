/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './DTO/create-course.dto';
import { Course } from './course.entity';
import { ApiTags } from '@nestjs/swagger';
import { GetCoursesDto } from './DTO/get.-course.dto';
import { NexCorusesDTO } from './DTO/NexCoursesDTO';
import { SearchDTO } from './DTO/SearchDTO';
import { CoursesDTO } from './DTO/CoursesDTO';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';

@ApiTags('Courses')
@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'asistente')
  async createCourse(
    @Body() createCourseDto: CreateCourseDto,
  ): Promise<{ message: string }> {
    return await this.courseService.createCourse(createCourseDto);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'asistente')
  async findAllCourses(
    @Query() query: GetCoursesDto,
  ): Promise<{ data: CoursesDTO[]; count: number }> {
    return await this.courseService.findAllCourses(query);
  }

  @Patch(':courseId')
  @UseGuards(AuthGuard)
  async patchCourseById(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Body() updateCourseDto: Partial<CreateCourseDto>,
  ): Promise<{ message: string }> {
    return await this.courseService.updateCourseById(courseId, updateCourseDto);
  }

  @Patch(':courseId/disable')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async disableCourse(
    @Param('courseId', ParseIntPipe) courseId: number,
  ): Promise<{ message: string }> {
    return await this.courseService.disableCourse(courseId);
  }

  @Get(':courseId/active')
  @UseGuards(AuthGuard)
  async getActiveCourseById(
    @Param('courseId', ParseIntPipe) courseId: number,
  ): Promise<Course> {
    try {
      const course = await this.courseService.getActiveCourseById(courseId);
      return course;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(
          `Active course with ID ${courseId} not found.`,
        );
      }
      throw new Error('Error retrieving active course.');
    }
  }

  @Get('/NextCourtes')
  async getNextCourses(
    @Query() SearchDTO: SearchDTO,
  ): Promise<{ data: NexCorusesDTO[]; count: number }> {
    return this.courseService.getNextCourses(SearchDTO);
  }

  @Get('User_Courses')
  @UseGuards(AuthGuard)
  async getCoursesByUserCedula(
    @Query() searchDTO: SearchDTO,
  ): Promise<{ data: NexCorusesDTO[]; count: number }> {
    return this.courseService.getCoursesByUserCedula(searchDTO);
  }

  @Get('CourseList')
  @UseGuards(AuthGuard)
  async CourseList(@Query('fecha') fecha: Date): Promise<CreateCourseDto[]> {
    return this.courseService.CourseList(fecha);
  }
}
