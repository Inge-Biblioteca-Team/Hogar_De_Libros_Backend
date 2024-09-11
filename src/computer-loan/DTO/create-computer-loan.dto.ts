import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateComputerLoanDto {


  @ApiProperty({
    example: 1,
    description: 'Id unico del equipo de computo que se va prestar',
  })
  @IsNumber()
  @IsNotEmpty()
  workStation: number;

  @ApiProperty({
    example: 1,
    description: 'Id unico del usuario administrador que aprueba el préstamo',
  })
  @IsString()
  @IsNotEmpty()
  AdminCedula: string;

  @ApiProperty({
    example: "Manuel ",
    description: 'Nombre del usuario que solicita el préstamo',
  })
  @IsString()
  @IsNotEmpty()
  UserName: string;

}

