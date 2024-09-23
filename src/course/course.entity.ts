import { ApiProperty } from '@nestjs/swagger';
import { Enrollment } from 'src/enrollment/enrollment.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne } from 'typeorm';

//import { Program } from './program.entity';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  @ApiProperty({ description: ' Fecha del curso' })
  date: Date;

  @Column()
  @ApiProperty({ description: ' Ubicacion' })
  location: string;

  
  @Column()
  @ApiProperty({ description: ' Perscona a cargo' })
  instructor: string;

 
  @Column()
  @ApiProperty({ description: ' Nombre del curso' })
  courseType: string;

 
  @Column()
  @ApiProperty({ description: ' Edad Objetivo' })
  targetAge: number;

  @Column()
  @ApiProperty({ description: ' Cupos disponibles' })
  capacity: number;

  @Column()
  @ApiProperty({ description: 'Imagen Curso' })
  image: string;

  @ManyToMany(() => Enrollment, (enrollment) => enrollment.courses)
  @JoinTable()
  enrollments: Enrollment[];

  // Relación 0.1 con Program
  //@ManyToOne(() => Program, (program) => program.courses, { nullable: true })
 // program: Program;
}