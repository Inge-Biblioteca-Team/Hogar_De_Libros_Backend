/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('advice')
export class Advice {
  @PrimaryGeneratedColumn()
  id_Advice: number;

  @Column()
  reason: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'datetime' })
  GenerateDate: Date = new Date();

  @Column()
  image: string;

  @Column()
  extraInfo: string;

  @Column()
  category: string;

  @Column({ default: true })
  status: boolean;
}
