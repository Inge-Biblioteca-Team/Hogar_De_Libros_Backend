/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class ResponseHistoryDto {
  @ApiProperty({ description: 'Número de máquina' })
  ComputerLoanId: number;

  @ApiProperty({ description: 'Número de máquina' })
  workStation: number;

  @ApiProperty({ description: 'Nombre del usuario' })
  UserName: string;

  @ApiProperty({description:"Cedula del usuario"})
  cedula:string

  @ApiProperty({ description: 'Fecha y hora de inicio del uso' })
  LoanStartDate: Date;

  @ApiProperty({ description: 'Fecha y hora de fin del uso' })
  LoanExpireDate: Date;

  @ApiProperty({ description: 'Estado del préstamo' })
  Status: string;
}
