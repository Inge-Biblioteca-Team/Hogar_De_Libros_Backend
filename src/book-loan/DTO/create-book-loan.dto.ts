/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import {  IsNotEmpty, IsNumber, IsString, IsDateString } from 'class-validator';

export class CreateBookLoanDto {
  @ApiProperty({
    example: '2024-09-11',
    description: 'Fecha en la que se recoge el libro',
  })
  @IsDateString({}, { message: 'BookPickUpDate debe estar en formato de fecha válido' })
  @IsNotEmpty({ message: 'Fecha de devolucion  es un campo obligatorio' })
  BookPickUpDate: string;

  @ApiProperty({
    example: '2024-09-18',
    description: 'Fecha en la que se debe devolver el libro',
  })
  @IsDateString({}, { message: 'LoanExpirationDate debe estar en formato de fecha válido' })
  @IsNotEmpty({ message: 'La fecha de expiracion del prestamo es un campo obligatorio' })
  LoanExpirationDate: string;

  @ApiProperty({
    example: 1,
    description: 'Id único del libro que se va a prestar',
  })
  @IsNumber()
  @IsNotEmpty({ message: 'Codigo de libro es un campo obligatorio' })
  bookBookCode: number;

  @ApiProperty({
    example: '12345678',
    description: 'Id único del usuario que solicita el préstamo',
  })
  @IsString()
  @IsNotEmpty({ message: 'Cedula es un campo obligatorio' })
  userCedula: string;
}
