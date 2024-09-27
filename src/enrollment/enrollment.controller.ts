/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { EnrollmentService } from 'src/enrollment/enrollment.service';
import { Enrollment } from 'src/enrollment/enrollment.entity';
import { CourseService } from 'src/course/course.service';
import { UserService } from 'src/user/user.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateEnrollmentDto } from './DTO/create-enrollment.dto';
import { PaginationEnrollmentListDto } from './DTO/pagination-enrollmentList.dto';

@ApiTags('Enrollments')
@Controller('enrollments')
export class EnrollmentController {
  constructor(
    private readonly enrollmentService: EnrollmentService,

    private readonly courseService: CourseService,
    private readonly userService: UserService,
  ) {}

  @Post(':courseId')
  @ApiOperation({ summary: 'Matricular un usuario a un curso' })
  @ApiResponse({
    status: 201,
    description: 'El usuario fue matriculado correctamente.',
    type: Enrollment,
  })
  @ApiResponse({
    status: 400,
    description:
      'El curso no tiene cupos disponibles o la información proporcionada es incorrecta.',
  })
  @ApiResponse({
    status: 404,
    description: 'Curso o usuario no encontrado.',
  })
  @ApiResponse({
    status: 409,
    description: 'El usuario ya está matriculado en este curso.',
  })
  async enrollUser(
    @Param('courseId') courseId: number,
    @Body() createEnrollmentDto: CreateEnrollmentDto,
  ): Promise<Enrollment> {
    try {
      // Verificar si el usuario ya está matriculado en el curso
      const existingEnrollment = await this.enrollmentService.findEnrollment(
        createEnrollmentDto.userCedula,
        courseId,
      );

      if (existingEnrollment) {
        // Enviar una excepción si el usuario ya está matriculado en este curso
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: 'El usuario ya está matriculado en este curso.',
          },
          HttpStatus.CONFLICT,
        );
      }

      // Matricular al usuario en el curso
      const enrollment = await this.enrollmentService.enrollUser(
        createEnrollmentDto,
        courseId,
      );

      return enrollment;
    } catch (error) {
      // Manejo de errores para curso no encontrado
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: error.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      // Manejo de errores para curso sin cupos o información incorrecta
      if (error instanceof BadRequestException) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: error.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
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
