/* eslint-disable prettier/prettier */
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { BookLoan } from '../book-loan.entity';

export class BookInfoDTO {
  @ApiProperty({ description: 'Código de signatura del libro' })
  signatureCode: string;

  @ApiProperty({ description: 'Código de inscripción del libro' })
  InscriptionCode: string;

  @ApiProperty({ description: 'Título del libro' })
  Author: string;

  @ApiProperty({ description: 'Título del libro' })
  Title: string;

  @ApiProperty({ description: 'ID del libro' })
  BookCode: number;
}

export class UserInfoDTO {
  @ApiProperty({ description: 'Nombre del usuario' })
  name: string;

  @ApiProperty({ description: 'Cédula del usuario' })
  cedula: string;

  @ApiProperty({ description: 'Apellido del usuario' })
  PhoneNumber: string;

  @ApiProperty({ description: 'Apellido del usuario' })
  Adress: string;
}

export class BookLoanResponseDTO {
  @ApiProperty({ description: 'Fecha de vencimiento del préstamo' })
  LoanExpirationDate: Date;

  @ApiProperty({ description: 'Fecha de recogida del libro' })
  BookPickUpDate: Date;

  @ApiProperty({ description: 'Estado del préstamo' })
  Status: string;

  @ApiProperty({ description: 'ID del préstamo' })
  BookLoanId: number;

  @ApiProperty({ description: 'Fecha de solicitud del préstamo' })
  LoanRequestDate: Date;

  @ApiProperty({ description: 'Observaciones del préstamo', nullable: true })
  Observations: string;

  @ApiProperty({ description: 'Datos del usuario' })
  user: UserInfoDTO;

  @ApiProperty({ description: 'Datos del libro' })
  book: BookInfoDTO;
}

export class extendDTO extends PartialType(BookLoan){
  oldObservations:string[] 
}
