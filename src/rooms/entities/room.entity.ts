import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'Rooms' })
export class Rooms {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  roomId: number;

  @Column()
  @ApiProperty()
  roomNumber: string;

  @Column({ nullable: true })
  @ApiProperty()
  name: string;

  @Column('float')
  @ApiProperty()
  area: number;

  @Column()
  @ApiProperty()
  capacity: number;

  @Column({ nullable: true })
  @ApiProperty()
  observations: string;

  @Column()
  @ApiProperty()
  image?: string;

  @Column()
  @ApiProperty()
  location: string;

  @Column({ type: 'char', length: 1, default: 'D' })
  @ApiProperty()
  status: string;
}
