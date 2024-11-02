/* eslint-disable prettier/prettier */
import { ApiProperty, } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateComputerLoanDto {
  
  @ApiProperty({
    example: 1,
    description: 'ID único del equipo de cómputo que se va a prestar',
  })
  @IsNumber()
  @IsNotEmpty({ message: 'El número de máquina es obligatorio' })
  MachineNumber: number;

  @ApiProperty({
    example: '123456789',
    description: 'Cédula única del usuario administrador que aprueba el préstamo',
  })
  @IsString()
  @IsNotEmpty({ message: 'La cédula es obligatoria' })
  cedula: string;

  @ApiProperty({
    example: 'Manuel',
    description: 'Nombre del usuario que solicita el préstamo',
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre del usuario es obligatorio' })
  UserName: string;

}
