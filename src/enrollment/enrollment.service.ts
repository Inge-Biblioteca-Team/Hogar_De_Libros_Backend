import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from './enrollment.entity';
import { Course } from '../course/course.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(User)  
    private readonly userRepository: Repository<User>, 
  ) {}

  async enrollUser(courseId: number, userCedula: string): Promise<Enrollment> {
    
    const course = await this.courseRepository.findOne({ where: { courseId } });
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }
  
    const user = await this.userRepository.findOne({
      where: { cedula: userCedula },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userCedula} not found`);
    }

    
    if (course.capacity <= 0) {
      throw new BadRequestException('No hay cupos disponibles para este curso');
    }

   
    const enrollment = this.enrollmentRepository.create({
      course,
      user, 
    });

    
    const savedEnrollment = await this.enrollmentRepository.save(enrollment);

    
    course.capacity -= 1;
    await this.courseRepository.save(course);

    return savedEnrollment;
  }
}
