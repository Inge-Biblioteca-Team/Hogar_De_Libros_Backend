/* eslint-disable prettier/prettier */
import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'friend_library' })
export class FriendsLibrary {
  @PrimaryGeneratedColumn()
  FriendId: number;

  @Column()
  UserFullName: string;

  @Column()
  UserCedula: string;

  @Column()
  Disability: string;

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

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }) 
  DateGenerated: Date;

  @Column({ nullable: true })
  DateRecolatedDonation?: Date;
 
  // infor extra de conocimiento previo (HACER)
  @Column({ nullable: true })
  ExtraInfo: string;
  
  @ManyToOne(() => User, (user) => user.friendsLibrary, { nullable: true })
  @JoinColumn({ name: 'User_Cedula', referencedColumnName: 'cedula' })
  user: User;
  rejectionReason: string;
}
