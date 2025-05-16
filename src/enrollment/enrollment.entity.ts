/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Course } from 'src/course/course.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Enrollment {
  @PrimaryGeneratedColumn()
  enrollmentId: number;

  @ApiProperty({ description: 'UserCedula '})
  @Column()
  userCedula?: string;

  @ApiProperty()
  @Column()
  enrollmentDate: Date = new Date();

  @ApiProperty({ description: 'CourseId ' })
  @Column()
  courseId: number;

  @ApiProperty({ description: 'Nombre de quien matricula' })
  @Column()
  UserName: string;

  @ApiProperty({ description: 'Direccion del matriculado ' })
  @Column()
  direction: string;

  @ApiProperty({ description: 'Telefono' })
  @Column()
  phone: string;

  @ApiProperty({ description: 'EmergenciPhone  ' })
  @Column()
  ePhone: string;

  @ApiProperty({ description: 'Email' })
  @Column()
  email: string;

  @ApiProperty({ description: 'Estado De la matricula ' })
  @Column({ default: 'Activa' })
  status: string;

  @ManyToOne(() => Course, (course) => course.enrollments)
  @JoinColumn({ name: 'courseId' })
  course: Course;

}
