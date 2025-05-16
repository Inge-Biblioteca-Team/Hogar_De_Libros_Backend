/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { FriendsLibrary } from '../friends-library/friend-library.entity';
import { RoomReservation } from '../room-reservation/entities/room-reservation.entity';

import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Donation } from '../donation/donation.entity';
import { Collaborator } from '../collaborator/collaborator.entity';

export enum Role {
  ExternalUser = 'external_user', //Puede solicitar libros bajo la política que se le establezca
  Reception = 'reception', // usuario destinado a consultas de libros y demás(Usuario de recepción)
  Asistente = 'asistente', // Asistentes pueden crear registros dar asistencia a la colección pero no borrar o dar de baja
  Admin = 'admin', //Puede incidir en todo
  Institucional = 'institucional', //Usuario con permiso de reservas de salas
}

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

  @Column({ default: 0 })
  loanPolicy: number;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.ExternalUser,
  })
  role: Role;


  @OneToMany(() => RoomReservation, (roomReservation) => roomReservation.user)
  roomReservations: RoomReservation[];

  @OneToMany(() => FriendsLibrary, (friendsLibrary) => friendsLibrary.user)
  friendsLibrary: FriendsLibrary[];

  @OneToMany(() => Donation, (donation) => donation.user)
  donation: Donation[];

  @OneToMany(() => Collaborator, (collaborator) => collaborator.user)
  collaborator: Collaborator[];
}
