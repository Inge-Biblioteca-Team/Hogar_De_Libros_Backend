/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Enrollment } from 'src/enrollment/enrollment.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

//import { Program } from './program.entity';

@Entity(({ name: 'course' }) )
export class Course {
  @PrimaryGeneratedColumn()
  courseId: number;

  @ApiProperty({ description: ' Fecha del curso' })
  @Column({ type: 'date' })
  date: Date;

  @ApiProperty( { description: ' Hora del curso' })
  @Column({ type: 'time' })
  courseTime: string;

 
  @ApiProperty({ description: ' Ubicacion' })
  @Column()
  location: string;

  @ApiProperty({ description: ' Perscona a cargo' })
  @Column()
  instructor: string;

  @ApiProperty({ description: ' Nombre del curso' })
  @Column()
  courseType: string;

  @ApiProperty({ description: ' Edad Objetivo' })
  @Column()
  targetAge: number;

  @ApiProperty({ description: ' Cupos disponibles' })
  @Column()
  capacity: number;

  @ApiProperty({ description: 'Estado actual del curso' })
  @Column()
  Status: boolean = true;

  @ApiProperty({ description: 'Imagen Curso' })
  @Column()
  image: string;

  @ApiProperty({ description: 'Duración del curso (por ejemplo, 2 horas)' })
  @Column()
  duration: string;  

  @ApiProperty({ description: 'Fecha final del curso' })
  @Column({ type: 'date' })
  endDate: Date;  

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments: Enrollment[];

  // Relación 0.1 con Program
  //@ManyToOne(() => Program, (program) => program.courses, { nullable: true })
 // program: Program;
}