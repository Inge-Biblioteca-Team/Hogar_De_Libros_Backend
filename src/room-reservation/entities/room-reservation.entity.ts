/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Course } from 'src/course/course.entity';
import { events } from 'src/events/events.entity';
import { Rooms } from 'src/rooms/entities/room.entity';
import { User } from 'src/user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('room_reservations')
export class RoomReservation {
  @PrimaryGeneratedColumn()
  rommReservationId: number;

  @Column({})
  @ApiProperty({ description: 'Nombre de la institucion' })
  name: string;

  @Column({ type: 'datetime' })
  @ApiProperty({ description: 'Fecha de emision' })
  reservationDate: Date;

  @Column({ type: 'date' })
  @ApiProperty({ description: 'Fecha Reservada' })
  date: Date;

  @Column({ type: 'simple-array' })
  selectedHours: number[];

  @Column({ type: 'text', nullable: true })
  observations: string;

  @Column()
  personNumber: string;

  @Column()
  reason: string;

  @Column({ default: '' })
  @ApiProperty()
  finishObservation: string;

  @Column({ default: 'Pendiente' })
  @ApiProperty()
  reserveStatus: string;

  @ManyToOne(() => events, (events) => events.roomReservations, {
    nullable: true,
  })
  @JoinColumn({ name: 'EventId', referencedColumnName: 'EventId' })
  events: events;

  @ManyToOne(() => Course, (course) => course.roomReservations, {
    nullable: true,
  })
  @JoinColumn({ name: 'courseId', referencedColumnName: 'courseId' })
  course: Course;

  @ManyToOne(() => User, (user) => user.roomReservations, { nullable: false })
  @JoinColumn({ name: 'userCedula', referencedColumnName: 'cedula' })
  user: User;

  @ManyToOne(() => Rooms, (rooms) => rooms.roomReservations)
  @JoinColumn({ name: 'roomId', referencedColumnName: 'roomId' })
  rooms: Rooms;
}

//estado por job
