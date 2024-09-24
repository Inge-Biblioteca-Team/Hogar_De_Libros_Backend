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

  async findAllCourses(): Promise<Course[]> {
    const courses = await this.courseRepository.find();
    
    // Lanzar NotFoundException si no se encontraron cursos
    if (!courses || courses.length === 0) {
      throw new NotFoundException('No se encontraron cursos.');
    }
    return courses;
  }

  async updateCourseById(courseId: number, updateCourseDto: Partial<CreateCourseDto>): Promise<Course> {
   
    const course = await this.courseRepository.findOne({ where: { courseId } });
    
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found.`);
    }
  
   
    Object.assign(course, updateCourseDto);
  

    return await this.courseRepository.save(course);
  }
  
}
