/* eslint-disable prettier/prettier */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Enrollment } from 'src/enrollment/enrollment.entity';
import { Programs } from 'src/programs/programs.entity';
import { RoomReservation } from 'src/room-reservation/entities/room-reservation.entity';

import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';

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
  @Column({ default: true })
  Status: boolean ;

  @ApiPropertyOptional({ description: 'Imagen Curso' })
  @Column()
  image: string="https://d11cuk1a0j5b57.cloudfront.net/blog/wp-content/uploads/2022/08/18125803/Mejores-plataformas-de-cursos.jpg";
  
  @ApiProperty({description:"Materiales del curso"})
  @Column()
  materials:string;

  @ApiProperty({ description: 'Duración del curso (por ejemplo, 2 horas)' })
  @Column()
  duration: string;  

  @ApiProperty({ description: 'Fecha final del curso' })
  @Column({ type: 'date' })
  endDate: Date; 
  

  @ApiProperty({ description: 'Id Programa', nullable: true  })
  @Column({ nullable: true, default:null })
  programProgramsId: number;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments: Enrollment[];
  
  @ManyToOne(() => Programs, (program) => program.courses, { nullable: true})
  program: Programs;

  @OneToMany(() => RoomReservation, roomReservation => roomReservation.course)
  roomReservations: RoomReservation[]; 
  
}