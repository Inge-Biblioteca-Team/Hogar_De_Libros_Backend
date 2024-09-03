import { ApiProperty } from '@nestjs/swagger';
import { BookLoan } from 'src/book-loan/book-loan.enity';
import { ComputerLoan } from 'src/computer-loan/computer-loan.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'User' })
export class User {
  @ApiProperty({ description: 'Id unico del usuario' })
  @PrimaryGeneratedColumn()
  UserId: number;

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
  PhoneNumber: number;

  @ApiProperty({ description: 'Provincia donde vive el usuario' })
  @Column()
  Province: string;

  @ApiProperty({ description: 'Distrito donde vive el usuario' })
  @Column()
  District: string;

  @ApiProperty({ description: 'Género del usuario' })
  @Column()
  Gender: string;

  @ApiProperty({ description: 'Dirreción de residencia del usuario' })
  @Column()
  Address: string;

  @ApiProperty({ description: 'Fecha de nacimiento del usuario' })
  @Column()
  BirthDate: Date;

  @ApiProperty({ description: 'Contraseña del usuario' })
  @Column()
  Password: string;

  @ApiProperty({ description: 'Fecha de regisro del usuario' })
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  RegisterDate: Date;

  @ApiProperty({ description: 'Número de teléfono del usuario' })
  @Column()
  AccpetTermsAndConditions: boolean;

  // Relaciones

  @OneToMany(() => BookLoan, (bookLoan) => bookLoan.BookLoanId)
  bookLoan: BookLoan[];

  @OneToMany(() => ComputerLoan, computerLoan => computerLoan.ComputerLoanId)
  computerLoan: ComputerLoan[];
}
