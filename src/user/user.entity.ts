/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { BookLoan } from 'src/book-loan/book-loan.enity';
import { ComputerLoan } from 'src/computer-loan/computer-loan.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Role } from './loan-policy';
import { RoomReservation } from 'src/room-reservation/entities/room-reservation.entity';
import { FriendsLibrary } from 'src/friends-library/friend-library.entity';

@Entity({ name: 'users' })
export class User {
  @ApiProperty()
  @PrimaryColumn()
  cedula: string;

  @ApiProperty({ description: 'Correo electrónico del usuario' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: 'Nombre del usuario' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Apellido del usuario' })
  @Column()
  lastName: string;

  @ApiProperty({ description: 'Número de teléfono del usuario' })
  @Column()
  phoneNumber: string;

  @ApiProperty({ description: 'Provincia donde vive el usuario' })
  @Column()
  province: string;

  @ApiProperty({ description: 'Distrito donde vive el usuario' })
  @Column()
  district: string;

  @ApiProperty({ description: 'Género del usuario' })
  @Column()
  gender: string;

  @ApiProperty({ description: 'Dirección de residencia del usuario' })
  @Column()
  address: string;

  @ApiProperty({ description: 'Fecha de nacimiento del usuario' })
  @Column({ type: 'date' })
  birthDate: Date;

  @ApiProperty({ description: 'Contraseña del usuario' })
  @Column()
  password: string;

  @ApiProperty({ description: 'Fecha de registro del usuario' })
  @Column({ type: 'date' })
  registerDate: Date = new Date();

  @ApiProperty({ description: 'Aceptación de términos y condiciones' })
  @Column()
  acceptTermsAndConditions: boolean;

  @Column()
  status: boolean;

  @Column({ default: false })
  IsFriend: boolean;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.Viewer,
  })
  role: Role;

  // Relaciones
  @OneToMany(() => BookLoan, (bookLoan) => bookLoan.user)
  bookLoans: BookLoan[];

  @OneToMany(() => ComputerLoan, (computerLoan) => computerLoan.user)
  computerLoan: ComputerLoan[];

  @OneToMany(() => RoomReservation, (roomReservation) => roomReservation.user)
  roomReservations: RoomReservation[];

  @OneToOne(() => FriendsLibrary, { nullable: true })
  @JoinColumn() // Se utiliza para crear la clave foránea en la tabla de usuarios
  friendsLibrary: FriendsLibrary | null;
}
