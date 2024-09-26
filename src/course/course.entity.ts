/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Enrollment } from 'src/enrollment/enrollment.entity';
import { Programs } from 'src/programs/programs.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

@Entity(({ name: 'courses' }) )
export class Course {
  
  @PrimaryGeneratedColumn()
  courseId: number;

  @ApiProperty({ description: 'Nombre del curso' })
  @Column( )
  courseName: string;

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

<<<<<<< Updated upstream
  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments: Enrollment[];
  
  @ManyToOne(() => Programs, (program) => program.courses)
  @JoinColumn({ name: 'programProgramsId' })
=======
  @ApiProperty({ description: 'Id Programa', nullable: true  })
  @Column({ nullable: true })
  programProgramsId: number;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments: Enrollment[];
  
  @ManyToOne(() => Programs, (program) => program.courses, { nullable: true })
>>>>>>> Stashed changes
  program: Programs;
  
}