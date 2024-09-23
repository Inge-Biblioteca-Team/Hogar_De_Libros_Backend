import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';
import { CreateCourseDto } from './create-course.dto';


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
  

}