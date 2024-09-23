import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { EnrollmentService } from 'src/enrollment/enrollment.service';
import { CourseService } from './course.service';
import { CreateCourseDto } from './create-course.dto';
import { Course } from './course.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Enrollment } from 'src/enrollment/enrollment.entity';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('courses')
export class CourseController {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentService: EnrollmentService,
    @InjectRepository(Course)
    private readonly courseService: CourseService,
  ) {}

  //@ApiBearerAuth('access-token')
 // @UseGuards(AuthGuard, RolesGuard)
 // @Roles('admin','external_user')
  @Post('courses')
  @ApiBody({ type: CreateCourseDto })
  @ApiResponse({
    status: 201,
    description: 'Create a new Course',
    type: Course,
  })
  async createCourse(
    @Body() createCourseDto: CreateCourseDto,
  ): Promise<Course> {
    const course = await this.courseService.createCourse(createCourseDto);
    return course;
  }
}
