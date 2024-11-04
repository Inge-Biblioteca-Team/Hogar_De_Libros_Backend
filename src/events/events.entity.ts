/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Programs } from 'src/programs/programs.entity';
import { RoomReservation } from 'src/room-reservation/entities/room-reservation.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'events' })
export class events {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Id del evento' })
  EventId: number;

  @Column()
  @ApiProperty({ description: 'Ubicación del evento' })
  Location: string;

  @Column()
  @ApiProperty({ description: 'Titulo del evento' })
  Title: string;

  @Column()
  @ApiProperty({ description: 'Detalles del evento' })
  Details: string;

  @Column()
  @ApiProperty({ description: 'Categoría del evento' })
  Category: string;

  @Column({type: 'date'})
  @ApiProperty({ description: 'Fecha del evento' })
  Date: Date;

  @Column({ type: 'time' })
  @ApiProperty({ description: 'Hora del evento' })
  Time: string;

  @Column()
  @ApiProperty({ description: 'Imagen del evento' })
  Image: string ='https://static.vecteezy.com/system/resources/previews/012/710/072/non_2x/event-planner-template-hand-drawn-cartoon-flat-illustration-with-planning-schedule-time-management-business-agenda-and-calendar-concept-vector.jpg';

  @Column()
  @ApiProperty({ description: 'Público objetivo del evento' })
  TargetAudience: string;

  @Column({default: 'Pendiente de ejecución' })
  @ApiProperty({ description: 'Estado del evento' })
  Status: string;

  @Column()
  @ApiProperty({ description: 'Persona encargada del evento' })
  InchargePerson: string;

  @ApiProperty({ description: 'Id Programa', nullable: true  })
  @Column({ nullable: true, default:null })
  programProgramsId: number;

  
  @OneToMany(() => RoomReservation, (roomReservation) => roomReservation.events)
  roomReservations: RoomReservation[]; 

  @ManyToOne(() => Programs, (program) => program.courses, { nullable: true})
  program: Programs;

}
