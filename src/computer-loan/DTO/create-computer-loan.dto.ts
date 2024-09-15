/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateComputerLoanDto {
  @ApiProperty({
    example: 1,
    description: 'Id unico del equipo de computo que se va prestar',
  })
  @IsNumber()
  @IsNotEmpty()
  MachineNumber: number;

  @ApiProperty({
    example: 1,
    description: 'Id unico del usuario administrador que aprueba el préstamo',
  })
  @IsString()
  @IsNotEmpty()
  cedula: string;

  @ApiProperty({
    example: 'Manuel ',
    description: 'Nombre del usuario que solicita el préstamo',
  })
  @IsString()
  @IsNotEmpty()
  UserName: string;
}
