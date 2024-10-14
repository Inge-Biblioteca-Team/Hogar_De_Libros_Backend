import { User } from "src/user/user.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'friend_library' })
export class FriendsLibrary {
  @PrimaryGeneratedColumn()
  friendId: number; // Cambiado a camelCase para seguir las convenciones

  @Column({ default: 'P' })
  status: string;

  @Column({ type: 'simple-array' })
  PrincipalCategory: string[]; // Usa "PrincipalCategory" porque TypeORM es case-sensitive

  @Column({ type: 'simple-array' })
  SubCategory: string[]; // Asegúrate de que el nombre de la propiedad sea exacto

  @Column({ type: 'simple-array', nullable: true })
  Document?: string[];

  @OneToOne(() => User, (user) => user.friendsLibrary)
  user: User;
}
