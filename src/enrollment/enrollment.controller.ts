import { Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { EnrollmentService } from 'src/enrollment/enrollment.service';
import { Enrollment } from 'src/enrollment/enrollment.entity';
import { CourseService } from 'src/course/course.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from 'src/course/course.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
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
}
