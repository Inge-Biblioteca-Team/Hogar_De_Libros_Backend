/* eslint-disable prettier/prettier */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from './enrollment.entity';
import { Course } from '../course/course.entity';
import { User } from 'src/user/user.entity';
import { CreateEnrollmentDto } from './DTO/create-enrollment.dto';

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

  async enrollUser(createEnrollmentDto: CreateEnrollmentDto, courseId: number): Promise<Enrollment> {
    const { userCedula } = createEnrollmentDto;
  
    // Buscar el curso por ID
    const course = await this.courseRepository.findOne({ where: { courseId } });
    if (!course) {
      throw new NotFoundException(`Curso con ID ${courseId} no encontrado`);
    }
    
    // Verificar capacidad del curso
    if (course.capacity <= 0) {
      throw new BadRequestException('No hay cupos disponibles para este curso');
    }
  
    // Buscar si el usuario ya está matriculado en el curso
    const existingEnrollment = await this.enrollmentRepository.findOne({
      where: {
        userCedula: userCedula,
        courseId: course.courseId,
      },
    });
    if (existingEnrollment) {
      throw new ConflictException('El usuario ya está matriculado en este curso');
    }
  
    let user;
  
    // Manejo de errores en la creación del usuario
    try {
      // Buscar al usuario por cédula, crear uno temporal si no existe
      user = await this.userRepository.findOne({ where: { cedula: userCedula } });
      if (!user) {
        console.log(`Usuario con cédula ${userCedula} no existe. Creando usuario temporal...`);
        
        const tempUser = this.userRepository.create({
          cedula: userCedula,
          email: `${userCedula}@temporal.com`,
          name: 'Usuario',
          lastName: 'Temporal',
          phoneNumber: '00000000',
          province: 'Desconocido',
          district: 'Desconocido',
          gender: 'Desconocido',
          address: 'Desconocido',
          birthDate: new Date('2000-01-01'), // Fecha genérica
          password: 'temporal123', // Contraseña genérica
          acceptTermsAndConditions: false,
          status: true
        });
  
        // Guardar el usuario temporal
        user = await this.userRepository.save(tempUser);
        console.log('Usuario temporal creado con éxito:', user);
      } else {
        console.log('Usuario encontrado:', user);
      }
    } catch (error) {
      console.error('Error al crear o guardar el usuario temporal:', error);
      throw new InternalServerErrorException('No se pudo crear o guardar el usuario temporal');
    }
  
    // Manejo de errores en la creación de la matrícula
    try {
      // Crear y guardar la matrícula
      const enrollment = this.enrollmentRepository.create({
        userCedula: user.cedula,
        courseId: course.courseId,
        enrollmentDate: new Date().toISOString(),
      });
  
      const savedEnrollment = await this.enrollmentRepository.save(enrollment);
      console.log('Matrícula creada con éxito:', savedEnrollment);
  
      // Actualizar la capacidad del curso
      course.capacity -= 1;
      await this.courseRepository.save(course);
  
      return savedEnrollment;
    } catch (error) {
      console.error('Error al guardar la matrícula:', error);
      throw new InternalServerErrorException('No se pudo guardar la matrícula');
    }
  }
  
  
  async findEnrollment(userCedula: string, courseId: number): Promise<Enrollment | null> {
    return this.enrollmentRepository.findOne({
      where: {
        userCedula: userCedula,
        courseId: courseId,
      },
    });
    
    }
  async cancelEnrollment(
    CourseID: number,
    UserCedula: string,
  ): Promise<{ message: string }> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: {
        user: { cedula: UserCedula },
        course: { courseId: CourseID },
      },
      relations: ['user', 'course'],
    });

    if (!enrollment) {
      throw new NotFoundException('No existe la matrícula');
    }

    const courseDate = enrollment.course.date;
    const courseTime = enrollment.course.courseTime;

    const courseStartDate = new Date(
      `${courseDate.toString().split('T')[0]}T${courseTime}`,
    );
    const currentDate = new Date();

    const hoursDifference =
      (courseStartDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60);

    if (hoursDifference < 72) {
      throw new ForbiddenException(
        'No se puede cancelar la matrícula menos de 72 horas antes del curso',
      );
    }

    enrollment.status = 'Cancelado';

    try {
      await this.enrollmentRepository.save(enrollment);
      return { message: 'Matrícula cancelada con éxito' };
    } catch (error) {
      throw new InternalServerErrorException('Error al cancelar la matrícula');
    }
  }

  async countActiveEnrollmentsByCourse(
    courseId: number,
    status: string = 'Activo',
  ): Promise<number> {
    const result = await this.enrollmentRepository
      .createQueryBuilder('enrollment')
      .select('COUNT(enrollment.enrollmentId)', 'enrollmentCount')
      .where('enrollment.courseId = :courseId', { courseId })
      .andWhere('enrollment.status = :status', { status })
      .getRawOne();

    return result.enrollmentCount ? parseInt(result.enrollmentCount, 10) : 0;
  }
}
