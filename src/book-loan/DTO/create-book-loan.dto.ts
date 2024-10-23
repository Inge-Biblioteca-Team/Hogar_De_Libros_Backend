/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBookLoanDto {
  @ApiProperty({
    example: '2024-09-11',
    description: 'Fecha en la que se recoge el libro',
  })
  @IsDate()
  
  BookPickUpDate: Date;

  @ApiProperty({
    example: '2024-09-18',
    description: 'Fecha en la que se debe devolver el libro',
  })
  @IsDate()
  @IsNotEmpty()
  LoanExpirationDate: Date;

  @ApiProperty({
    example: 1,
    description: 'Id unico del libro que se va prestar',
  })
  
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
  @IsString()
  @IsNotEmpty()
  userCedula: string;
}
