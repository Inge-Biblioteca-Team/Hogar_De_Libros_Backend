/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('notes')
export class Note {
  @PrimaryGeneratedColumn()
  id_Note: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'date', nullable: true, default: null })
  deletedAt: Date;

  @Column()
  message: string;

  @Column()
  type: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({ default: false })
  trash: boolean;
}
