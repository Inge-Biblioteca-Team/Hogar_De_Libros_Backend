import { User } from "src/user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'friend_library' })
export class FriendsLibrary {
  @PrimaryGeneratedColumn()
  friendId: number;

  @Column({ default: 'P' })
  status: string;

  @Column()
  PrincipalCategory: string

  @Column()
  SubCategory: string; 

  @Column({ type: 'simple-array', nullable: true })
  Document?: string[];

  @Column({ type: 'simple-array', nullable: true })
  Image?: string[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  DateGenerated: Date;

  @Column({nullable: true})
  DateRecolatedDonation?: Date;

  @Column()
  UserCedula: string;

  @ManyToOne(() => User, (user) => user.friendsLibrary,{ eager: true })
  @JoinColumn({ name: 'UserCedula', referencedColumnName: 'cedula' })
  user: User;
}
