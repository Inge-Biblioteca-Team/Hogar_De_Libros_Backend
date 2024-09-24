/* eslint-disable prettier/prettier */
import { BadRequestException, Body, ConflictException, Controller, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './DTO/create-course.dto';
import { Course } from './course.entity';
import { ApiBody, ApiResponse, ApiTags, PartialType } from '@nestjs/swagger';
import { GetCoursesDto } from './DTO/get.-course.dto';
import { NexCorusesDTO } from './DTO/NexCoursesDTO';
import { SearchDTO } from './DTO/SearchDTO';

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
  
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Lista de cursos obtenida exitosamente',
    type: [Course],  
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontraron cursos',
  })
  @ApiResponse({
    status: 400,
    description: 'Error en la solicitud',
  })

  async findAllCourses(@Query() query: GetCoursesDto): Promise<{ data: Course[], count: number }> {
    try {
      const { page, limit } = query;
      const courses = await this.courseService.findAllCourses(page, limit);
      
      if (!courses.data || courses.data.length === 0) {
        throw new NotFoundException('No se encontraron cursos.');
      }
      
      return courses;
    } catch (error) {
      if (error.name === 'QueryFailedError') {
        throw new BadRequestException('Error al procesar la solicitud.');
      }
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

  @Patch(':courseId/disable')
  @ApiResponse({
    status: 200,
    description: 'Course disabled successfully',
    type: Course,
  })
  @ApiResponse({
    status: 404,
    description: 'Course not found',
  })
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
  @ApiResponse({
    status: 200,
    description: 'Active course found',
    type: Course,
  })
  @ApiResponse({
    status: 404,
    description: 'Active course not found',
  })
  async getActiveCourseById(
    @Param('courseId', ParseIntPipe) courseId: number,
  ): Promise<Course> {
    try {
      const course = await this.courseService.getActiveCourseById(courseId);
      return course;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Active course with ID ${courseId} not found.`);
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
  async getCoursesByUserCedula(
    @Query() searchDTO: SearchDTO,
  ): Promise<{ data: NexCorusesDTO[]; count: number }> {
    return this.courseService.getCoursesByUserCedula(searchDTO);
  }
  
}
