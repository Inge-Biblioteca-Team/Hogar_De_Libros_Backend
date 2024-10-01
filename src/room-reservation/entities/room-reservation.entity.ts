import { Course } from 'src/course/course.entity';
import { events } from 'src/events/events.entity';
import { Rooms } from 'src/rooms/entities/room.entity';
import { User } from 'src/user/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('room_reservations')
export class RoomReservation {
  @PrimaryGeneratedColumn()
  rommReservationId: number;

  @Column({})
  name: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({ type: 'text', nullable: true })
  observations: string;

  @Column({ nullable: true })
  images: string;

  @ManyToOne(() => events, (events) => events.roomReservations, {
    nullable: true,
  })
  events: events;

  @ManyToOne(() => Course, (course) => course.roomReservations, {
    nullable: true,
  })
  course: Course;
  @ManyToOne(() => User, (user) => user.roomReservations, { nullable: false })
  user: User;

  @ManyToOne(() => Rooms, (rooms) => rooms.roomReservations)
  @JoinColumn({ name: 'roomId', referencedColumnName: 'roomId' })
  rooms: Rooms;
}
