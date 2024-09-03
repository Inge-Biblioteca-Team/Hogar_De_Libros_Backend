import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateComputerLoanDto {
  @ApiProperty({ description: 'Fecha en la que se solicita el préstamo' })
  @IsDate()
  @IsNotEmpty()
  ComputerLoanReserveDate: Date;

  @ApiProperty({ description: 'Fecha en la termina el préstamo' })
  @IsDate()
  @IsNotEmpty()
  ComputerLoanExpireDate: Date;

  @ApiProperty({ description: 'Estado en el cual se encuentra el préstamo' })
  @IsString()
  @IsNotEmpty()
  Status: string;

  @ApiProperty({
    example: 1,
    description: 'Id unico del equipo de computo que se va prestar',
  })
  @IsNumber()
  @IsNotEmpty()
  MachineNumber: number;

  @ApiProperty({
    example: 1,
    description: 'Id unico del usuario que solicita el préstamo',
  })
  @IsNumber()
  @IsNotEmpty()
  UserId: number;

}

