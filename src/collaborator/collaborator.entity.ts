/* eslint-disable prettier/prettier */
import { User } from 'src/user/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
  UserAddress: string;

  @Column()
  UserPhone: string;

  @Column()
  UserEmail: string;

  @Column({ default: 'P' })
  Status: string;

  @Column()
  PrincipalCategory: string;

  @Column()
  SubCategory: string;

  @Column({ nullable: true })
  Experience?: string;

  @Column({ type: 'simple-array', nullable: true }) // DOcumento y Imagen mismo campo
  Document?: string[];

  @Column({ type: 'date'})
  DateGenerated: Date = new Date();


  @Column({ nullable: true,  })
  ExtraInfo: string;

  @Column({ nullable: true })
  Reason?: string;

  @ManyToOne(() => User, (user) => user.collaborator, { nullable: true })
  @JoinColumn({ name: 'User_Cedula', referencedColumnName: 'cedula' })
  user: User;
}
