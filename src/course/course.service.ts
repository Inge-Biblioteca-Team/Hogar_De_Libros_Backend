import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';
import { CreateCourseDto } from './DTO/create-course.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async createCourse(createCourseDto: CreateCourseDto): Promise<Course> {
    const course = this.courseRepository.create(createCourseDto);
    const savedCourse = await this.courseRepository.save(course);
    return savedCourse;
  }

  async findAllCourses(page: number, limit: number): Promise<{ data: Course[], count: number }> {
    const [courses, count] = await this.courseRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
  
    
    if (!courses || courses.length === 0) {
      throw new NotFoundException('No se encontraron cursos.');
    }
  
    return { data: courses, count };
  }

  async updateCourseById(courseId: number, updateCourseDto: Partial<CreateCourseDto>): Promise<Course> {
   
    const course = await this.courseRepository.findOne({ where: { courseId } });
    
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found.`);
    }
  
   
    Object.assign(course, updateCourseDto);
  

    return await this.courseRepository.save(course);
  }
  
  async disableCourse(courseId: number): Promise<Course> {
    // Buscar el curso por su ID
    const course = await this.courseRepository.findOne({ where: { courseId } });
    
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found.`);
    }

    // Cambiar el estado a "false" (deshabilitado)
    course.Status = false;

    // Guardar el curso actualizado
    return await this.courseRepository.save(course);
  }

  async getActiveCourseById(courseId: number): Promise<Course> {
    const course = await this.courseRepository.findOne({ 
      where: { courseId, Status: true },  // Solo cursos activos
    });

    if (!course) {
      throw new NotFoundException(`Active course with ID ${courseId} not found.`);
    }

    return course;
  }
}
