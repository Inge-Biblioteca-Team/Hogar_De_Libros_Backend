/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { BookLoan } from 'src/book-loan/book-loan.enity';
import { ComputerLoan } from 'src/computer-loan/computer-loan.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Role } from './loan-policy';
import { Enrollment } from 'src/enrollment/enrollment.entity';
import { RoomReservation } from 'src/room-reservation/entities/room-reservation.entity';

@Entity({ name: 'users' }) 
export class User {

  @ApiProperty()
  @PrimaryColumn()
  cedula:string;

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
  @Column({ type: 'date'})
  registerDate: Date = new Date();

  @ApiProperty({ description: 'Aceptación de términos y condiciones' })
  @Column()
  acceptTermsAndConditions: boolean;

  @Column()
  status:boolean;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.Viewer
  })
  role: Role;

  // Relaciones
  @OneToMany(() => BookLoan, bookLoan => bookLoan.user)
  bookLoans: BookLoan[];

  @OneToMany(() => ComputerLoan, (computerLoan) => computerLoan.user)
  computerLoan: ComputerLoan[];

  @OneToMany(() => Enrollment, (enrollment) => enrollment.user)
  enrollments: Enrollment[];
  
  @OneToMany(() => RoomReservation, roomReservation => roomReservation.user)
  roomReservations: RoomReservation[]; 
  
  }
