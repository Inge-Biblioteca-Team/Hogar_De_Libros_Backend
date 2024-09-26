/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Course } from 'src/course/course.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';


@Entity(({ name: 'programs' }) )
export class Programs {

  @PrimaryGeneratedColumn()
  programsId: number;

  @ApiProperty({ description: 'Nombre del programa' })
  @Column( )
  programName: string;

  @ApiProperty({ description: 'Descripcion' })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ description: 'Imagen del programa' })
  @Column()
  image: string;

  @ApiProperty({ description: 'Estado' ,default:true})
  @Column({ default: true })
  status: boolean;
  
  @OneToMany(() => Course, (course) => course.program)
  courses: Course[];
}
