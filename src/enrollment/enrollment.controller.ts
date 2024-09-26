/* eslint-disable prettier/prettier */
import {
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { EnrollmentService } from 'src/enrollment/enrollment.service';
import { Enrollment } from 'src/enrollment/enrollment.entity';
import { CourseService } from 'src/course/course.service';
import { UserService } from 'src/user/user.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Enrollments')
@Controller('enrollments')
export class EnrollmentController {
  constructor(
    private readonly enrollmentService: EnrollmentService,

    private readonly courseService: CourseService,
    private readonly userService: UserService,
  ) {}

  @Post('enroll/:courseId/:userCedula')
  async enrollUser(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('userCedula') userCedula: string,
  ): Promise<Enrollment> {
    const enrollment = await this.enrollmentService.enrollUser(
      courseId,
      userCedula,
    );
    return enrollment;
  }
  @Patch('/cancel')
  async cancelEnrollment(
    @Query('courseId') courseId: number,
    @Query('userCedula') userCedula: string,
  ): Promise<{ message: string }> {
    return this.enrollmentService.cancelEnrollment(courseId, userCedula);
  }
}
