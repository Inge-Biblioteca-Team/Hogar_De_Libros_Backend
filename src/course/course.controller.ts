/* eslint-disable prettier/prettier */
import {
  BadRequestException,
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
import { ApiBody, ApiResponse, ApiTags, PartialType } from '@nestjs/swagger';
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
  constructor(
    // private readonly enrollmentService: EnrollmentService,

    private readonly courseService: CourseService,
  ) {}

// PROMISE MESSAGE
  @Post()
  @UseGuards(AuthGuard,RolesGuard)
  @Roles('admin', 'asistente')
  async createCourse(
    @Body() createCourseDto: CreateCourseDto,
  ): Promise<Course> {
    try {
      const course = await this.courseService.createCourse(createCourseDto);
      return course;
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      // Cualquier otro error
      throw new BadRequestException(
        errorMessage || 'Error inesperado al crear el curso.',
      );
    }
  }

  @Get()
  @UseGuards(AuthGuard,RolesGuard)
  @Roles('admin', 'asistente')
  async findAllCourses(
    @Query() query: GetCoursesDto,
  ): Promise<{ data: CoursesDTO[]; count: number }> {
    return await this.courseService.findAllCourses(query)
  }

  // PROMISE MESSAGE
  @Patch(':courseId')
  @UseGuards(AuthGuard)
  async patchCourseById(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Body() updateCourseDto: Partial<CreateCourseDto>,
  ): Promise<Course> {
    try {
      const updatedCourse = await this.courseService.updateCourseById(
        courseId,
        updateCourseDto,
      );
      return updatedCourse;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Course with ID ${courseId} not found.`);
      }

      throw new BadRequestException('Error actualizando el curso.');
    }
  }

  // PROMISE MESSAGE
  @Patch(':courseId/disable')
  @UseGuards(AuthGuard,RolesGuard)
  @Roles('admin')
  async disableCourse(
    @Param('courseId', ParseIntPipe) courseId: number,
  ): Promise<Course> {
    try {
      const disabledCourse = await this.courseService.disableCourse(courseId);
      return disabledCourse;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Course with ID ${courseId} not found.`);
      }
      throw new Error('Error deshabilitando el curso.');
    }
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
