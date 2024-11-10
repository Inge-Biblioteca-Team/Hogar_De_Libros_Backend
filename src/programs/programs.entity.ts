/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Course } from 'src/course/course.entity';
import { events } from 'src/events/events.entity';
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
  image: string='https://www.comunidadbaratz.com/wp-content/uploads/Todas-las-personas-deberian-ir-a-la-biblioteca-al-menos-una-vez-a-la-semana.jpg';

  @ApiProperty({ description: 'Estado' ,default:true})
  @Column({ default: true })
  status: boolean;
  
  @OneToMany(() => Course, (course) => course.program)
  courses: Course[];

  @OneToMany(() => events, (event) => event.program)
  events: events[];
}
