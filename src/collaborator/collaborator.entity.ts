/* eslint-disable prettier/prettier */
import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'collaborator' })
export class Collaborator {
  @PrimaryGeneratedColumn()
  CollaboratorId: number;

  @Column()
  UserFullName: string;

  @Column({ nullable: true })
  Entitycollaborator?: string;

  @Column()
  UserCedula: string;

  @Column({ type: 'date' })
  UserBirthDate: Date;

  @Column()
  UserGender: string;

  @Column()
  UserAddress: string;

  @Column()
  UserPhone: string;

  @Column()
  UserEmail: string;

  @Column({ default: 'Pendiente' })
  Status: string;

  @Column()
  PrincipalCategory: string;

  @Column()
  SubCategory: string;

  @Column({ nullable: true })
  Experience?: string;

  @Column({ type: 'simple-array', nullable: true }) // DOcumento y Imagen mismo campo
  Document?: string[];

  @Column({ type: 'date' })
  DateGenerated: Date = new Date();

  @Column({ default: 'No posee experiencia previa' })
  ExtraInfo: string;

  @Column()
  Description: string;

  @Column({ nullable: true })
  Reason?: string;

  @Column({ type: 'date' })
  activityDate: Date;

  @ManyToOne(() => User, (user) => user.collaborator, { nullable: true })
  @JoinColumn({ name: 'User_Cedula', referencedColumnName: 'cedula' })
  user: User;
}
