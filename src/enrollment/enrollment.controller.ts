/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { EnrollmentService } from 'src/enrollment/enrollment.service';
import {  ApiTags } from '@nestjs/swagger';
import { CreateEnrollmentDto } from './DTO/create-enrollment.dto';
import { PaginationEnrollmentListDto } from './DTO/pagination-enrollmentList.dto';

@ApiTags('Enrollments')
@Controller('enrollments')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post(':courseId')
  async enrollUser(
    @Body() createEnrollmentDto: CreateEnrollmentDto,
    @Param('courseId') courseId: number,
  ): Promise<{ message: string }> {
    return this.enrollmentService.enrollUser(createEnrollmentDto, courseId);
  }

  @Patch('/cancel')
  async cancelEnrollment(
    @Query('courseId') courseId: number,
    @Query('userCedula') userCedula: string,
  ): Promise<{ message: string }> {
    return this.enrollmentService.cancelEnrollment(courseId, userCedula);
  }

  @Get()
  async getEnrollmentsListByIdCourse(
    @Query() paginationEnrollmentListDTO: PaginationEnrollmentListDto,
  ) {
    return this.enrollmentService.getEnrollmentsListByIdCourse(
      paginationEnrollmentListDTO,
    );
  }
}
