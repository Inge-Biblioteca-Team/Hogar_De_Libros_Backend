import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBookLoanDto {
  @ApiProperty({
    example: '2024-09-10T00:00:00Z',
    description: 'Fecha en la que se solicita el préstamo',
  })
  @IsDate()
  @IsNotEmpty()
  LoanRequestDate: Date;

  @ApiProperty({
    example: '2024-09-11T13:30:00Z',
    description: 'Fecha en la que se recoge el libro',
  })
  @IsDate()
  @IsNotEmpty()
  BookPickUpDate: Date;

  @ApiProperty({
    example: '2024-09-18T13:30:00Z',
    description: 'Fecha en la que se debe devolver el libro',
  })
  @IsDate()
  @IsNotEmpty()
  LoanExpirationDate: Date;

  @ApiProperty({
    example: 'Finalizado',
    description: 'Estado del préstamo',
  })
  Status: string;

  @ApiProperty({
    example: 1,
    description: 'Id unico del libro que se va prestar',
  })
  @IsNumber()
  @IsNotEmpty()
  BookCode: number;

  @ApiProperty({
    example: 1,
    description: 'Id unico del usuario que solicita el préstamo',
  })
  @IsNumber()
  @IsNotEmpty()
  UserId: number;
}
