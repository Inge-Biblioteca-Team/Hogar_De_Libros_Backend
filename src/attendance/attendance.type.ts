/* eslint-disable prettier/prettier */
import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm/decorator/entity/Entity';

@Entity({ name: 'attendance' })
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cedula: string;
  @Column()
  name: string;
  @Column()
  age: string;
  @Column()
  gender: string;

  @Column({ type: 'date' })
  date: Date;
  
}
