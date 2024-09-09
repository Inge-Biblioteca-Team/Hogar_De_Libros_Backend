/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { BookLoan } from 'src/book-loan/book-loan.enity';
import { ComputerLoan } from 'src/computer-loan/computer-loan.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' }) 
export class User {
  @ApiProperty({ description: 'Id único del usuario' })
  @PrimaryGeneratedColumn()
  Cedula: number;

  @ApiProperty({ description: 'Correo electrónico del usuario' })
  @Column({ unique: true })
  Email: string;

  @ApiProperty({ description: 'Nombre del usuario' })
  @Column()
  Name: string;

  @ApiProperty({ description: 'Apellido del usuario' })
  @Column()
  LastName: string;

  @ApiProperty({ description: 'Número de teléfono del usuario' })
  @Column()
  PhoneNumber: string;

  @ApiProperty({ description: 'Provincia donde vive el usuario' })
  @Column()
  Province: string;

  @ApiProperty({ description: 'Distrito donde vive el usuario' })
  @Column()
  District: string;

  @ApiProperty({ description: 'Género del usuario' })
  @Column()
  Gender: string;

  @ApiProperty({ description: 'Dirección de residencia del usuario' })
  @Column()
  Address: string;

  @ApiProperty({ description: 'Fecha de nacimiento del usuario' })
  @Column()
  BirthDate: Date;

  @ApiProperty({ description: 'Contraseña del usuario' })
  @Column()
  Password: string;

  @ApiProperty({ description: 'Fecha de registro del usuario' })
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  RegisterDate: Date;

  @ApiProperty({ description: 'Aceptación de términos y condiciones' })
  @Column()
  AcceptTermsAndConditions: boolean;

  // Relaciones
  @OneToMany(() => BookLoan, bookLoan => bookLoan.user)
  bookLoans: BookLoan[];

  @OneToMany(() => ComputerLoan, computerLoan => computerLoan.user)
  computerLoan: ComputerLoan[];
}
