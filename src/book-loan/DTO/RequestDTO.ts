/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class BookInfoDTO {
  @ApiProperty({ description: 'Título del libro' })
  Title: string;

  @ApiProperty({ description: 'Código de signatura del libro' })
  signatureCode: string;

  @ApiProperty({ description: 'Código de inscripción del libro' })
  InscriptionCode: string;

  @ApiProperty({ description: 'ID del libro' })
  BookCode: number; 
}

export class UserInfoDTO {
  @ApiProperty({ description: 'Nombre del usuario' })
  name: string;

  @ApiProperty({ description: 'Apellido del usuario' })
  lastName: string;

  @ApiProperty({ description: 'Cédula del usuario' })
  cedula: string; 
}

export class BookLoanResponseDTO {
  @ApiProperty({ description: 'Estado del préstamo' })
  Status: string;

  @ApiProperty({ description: 'ID del préstamo' })
  BookLoanId: number;

  @ApiProperty({ description: 'Fecha de solicitud del préstamo' })
  LoanRequestDate: Date;

  @ApiProperty({ description: 'Fecha de recogida del libro' })
  BookPickUpDate: Date;

  @ApiProperty({ description: 'Fecha de vencimiento del préstamo' })
  LoanExpirationDate: Date;

  @ApiProperty({ description: 'Observaciones del préstamo', nullable: true })
  Observations: string;

  @ApiProperty({ description: 'Datos del usuario' })
  user: UserInfoDTO;

  @ApiProperty({ description: 'Datos del libro' })
  book: BookInfoDTO;

  
}
