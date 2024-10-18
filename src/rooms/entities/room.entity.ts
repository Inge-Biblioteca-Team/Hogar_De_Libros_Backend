/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { RoomReservation } from 'src/room-reservation/entities/room-reservation.entity';



@Entity({ name: 'rooms' })
export class Rooms {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  roomId: number;

  @Column()
  @ApiProperty()
  roomNumber: string;

  @Column({ nullable: true })
  @ApiProperty({ description: 'nombre de la sala' })
  name: string;

  @Column('float')
  @ApiProperty({ description: 'M²' })
  area: number;

  @Column()
  @ApiProperty()
  capacity: number;

  @Column({ nullable: true })
  @ApiProperty()
  observations: string;

  @Column({ type: 'simple-array', nullable: true })
  image?: string[];
  @Column()
  @ApiProperty()
  location: string;

  @Column({ type: 'char', length: 1, default: 'D' })
  @ApiProperty()
  status: string;

  @OneToMany(() => RoomReservation, (roomReservation) => roomReservation.rooms)
  roomReservations: RoomReservation[];
}
