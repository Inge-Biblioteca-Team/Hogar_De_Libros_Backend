/* eslint-disable prettier/prettier */
import { User } from 'src/user/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'donation' })
export class Donation {
  @PrimaryGeneratedColumn()
  DonationID: number;

  @Column()
  UserFullName: string;

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

  @Column({ type: 'simple-array', nullable: true }) // DOcumento y Imagen mismo campo
  Document?: string[];

  @Column({ type: 'date'})
  DateGenerated: Date = new Date();

  @Column({type: 'date'})
  DateRecolatedDonation: Date;

  @Column({ nullable: true })
  ExtraInfo: string;

  @Column()
  ResourceCondition: string;

  @Column({ nullable: true })
  Reason?: string;

  @ManyToOne(() => User, (user) => user.donation, { nullable: true })
  @JoinColumn({ name: 'User_Cedula', referencedColumnName: 'cedula' })
  user: User;
}
