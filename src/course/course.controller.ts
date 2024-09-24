import { BadRequestException, Body, ConflictException, Controller, Get, InternalServerErrorException, NotFoundException, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { EnrollmentService } from 'src/enrollment/enrollment.service';
import { CourseService } from './course.service';
import { CreateCourseDto } from './DTO/create-course.dto';
import { Course } from './course.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Enrollment } from 'src/enrollment/enrollment.entity';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags, PartialType } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('Courses')
@Controller('courses')
export class CourseController {
  constructor(
    
    // private readonly enrollmentService: EnrollmentService,
   
    private readonly courseService: CourseService,
  ) {}

  //@ApiBearerAuth('access-token')
 // @UseGuards(AuthGuard, RolesGuard)
 // @Roles('admin','external_user')
  
 @Post()
 @ApiBody({ type: CreateCourseDto })
 @ApiResponse({
   status: 201,
   description: 'Create a new Course',
   type: Course,
 })
 @ApiResponse({
   status: 400,
   description: 'Bad Request: Datos inválidos',
 })
 @ApiResponse({
   status: 409,
   description: 'Conflict: Conflicto de datos (ej. curso ya existe)',
 })

 async createCourse(
   @Body() createCourseDto: CreateCourseDto,
 ): Promise<Course> {
   try {
    
     const course = await this.courseService.createCourse(createCourseDto);
     
     return course;
    
   } catch (error) {
     
     if (error.code === 'ER_BAD_NULL_ERROR') {
       throw new BadRequestException('Uno o más campos son requeridos y no pueden ser nulos.');
     }

     // Manejo de errores por conflictos, como duplicación de cursos
     if (error.code === 'ER_DUP_ENTRY') {
       throw new ConflictException('Ya existe un curso con este nombre o identificador.');
     }

   
   }

 }

 @Get()
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all courses',
    type: [Course],
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found: No se encontraron cursos',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: Error en la solicitud',
  })
  async findAllCourses(): Promise<Course[]> {
    try {
      // Intentamos obtener todos los cursos
      const courses = await this.courseService.findAllCourses();
      if (!courses || courses.length === 0) {
        throw new NotFoundException('No se encontraron cursos.');
      }
      return courses;
    } catch (error) {
      // Manejo de errores por solicitud inválida
      if (error.name === 'QueryFailedError') {
        throw new BadRequestException('Error al procesar la solicitud.');
      }
      // Si el error es otro, se puede lanzar una excepción genérica
      throw new BadRequestException('Ocurrió un error al intentar obtener los cursos.');
    }
  }
  @Patch(':courseId')
  @ApiBody({ type: PartialType(CreateCourseDto) })
  @ApiResponse({
    status: 200,
    description: 'Course updated successfully',
    type: Course,
  })
  @ApiResponse({
    status: 404,
    description: 'Course not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data',
  })
  async patchCourseById(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Body() updateCourseDto: Partial<CreateCourseDto>,
  ): Promise<Course> {
    try {
      const updatedCourse = await this.courseService.updateCourseById(courseId, updateCourseDto);
      return updatedCourse;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Course with ID ${courseId} not found.`);
      }
  
     
      throw new BadRequestException('Error actualizando el curso.');
    }
  }
}
