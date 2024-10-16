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
  UserName: string;

  @Column()
  UserLastName: string;

  @Column()
  UserCedula: string;

  @Column()
  UserGender: string;

  @Column()
  UserAge: number;

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

  @Column({ type: 'simple-array', nullable: true })
  Document?: string[];

  @Column({ type: 'simple-array', nullable: true })
  Image?: string[];

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  DateGenerated: Date;

  @Column({ nullable: true })
  DateRecolatedDonation?: Date;

  @ManyToOne(() => User, (user) => user.friendsLibrary, { nullable: true })
  @JoinColumn({ name: 'User_Cedula', referencedColumnName: 'cedula' })
  user: User;
}
