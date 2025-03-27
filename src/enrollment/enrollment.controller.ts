/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { EnrollmentService } from 'src/enrollment/enrollment.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateEnrollmentDto } from './DTO/create-enrollment.dto';
import { PaginationEnrollmentListDto } from './DTO/pagination-enrollmentList.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Response } from 'express';

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
  @UseGuards(AuthGuard)
  async getEnrollmentsListByIdCourse(
    @Query() paginationEnrollmentListDTO: PaginationEnrollmentListDto,
  ) {
    return this.enrollmentService.getEnrollmentsListByIdCourse(
      paginationEnrollmentListDTO,
    );
  }

  @Post('/Save-List/:courseID')
  async generatePdf(@Param('courseID') courseID: number, @Res() res: Response) {
    const pdfBuffer = await this.enrollmentService.saveEnrollmentList(courseID);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Lista_Matricula_${courseID}.pdf"`,
    });
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    res.send(pdfBuffer);
  }
}
