/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBookLoanDto {
  @ApiProperty({
    example: '2024-09-10T00:00:00Z',
    description: 'Fecha en la que se solicita el préstamo',
  })
  @IsDate()
  LoanRequestDate: Date;

  @ApiProperty({
    example: '2024-09-11T13:30:00Z',
    description: 'Fecha en la que se recoge el libro',
  })
  @IsDate()
  
  BookPickUpDate: Date;

  @ApiProperty({
    example: '2024-09-18T13:30:00Z',
    description: 'Fecha en la que se debe devolver el libro',
  })
  @IsDate()
  @IsNotEmpty()
  LoanExpirationDate: Date;

  @ApiProperty({
    example: 1,
    description: 'Id unico del libro que se va prestar',
  })
  @IsNumber()
  @IsNotEmpty()
  bookBookCode: number;

  @ApiProperty({
    example: 1,
    description: 'Id unico del usuario que solicita el préstamo',
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
