/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EnrollmentService } from 'src/enrollment/enrollment.service';
import {  ApiTags } from '@nestjs/swagger';
import { CreateEnrollmentDto } from './DTO/create-enrollment.dto';
import { PaginationEnrollmentListDto } from './DTO/pagination-enrollmentList.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { Role } from 'src/user/user.entity';

@ApiTags('Enrollments')
@Controller('enrollments')
@UseGuards(AuthGuard, RolesGuard)
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post(':courseId')
  @Roles(Role.Admin, Role.Creator, Role.ExternalUser)
  async enrollUser(
    @Body() createEnrollmentDto: CreateEnrollmentDto,
    @Param('courseId') courseId: number,
  ): Promise<{ message: string }> {
    return this.enrollmentService.enrollUser(createEnrollmentDto, courseId);
  }

  @Patch('/cancel')
  @Roles(Role.Admin, Role.Creator, Role.ExternalUser)
  async cancelEnrollment(
    @Query('courseId') courseId: number,
    @Query('userCedula') userCedula: string,
  ): Promise<{ message: string }> {
    return this.enrollmentService.cancelEnrollment(courseId, userCedula);
  }

  @Get()
  @Roles(Role.Admin, Role.Creator, Role.ExternalUser)
  async getEnrollmentsListByIdCourse(
    @Query() paginationEnrollmentListDTO: PaginationEnrollmentListDto,
  ) {
    return this.enrollmentService.getEnrollmentsListByIdCourse(
      paginationEnrollmentListDTO,
    );
  }
}
