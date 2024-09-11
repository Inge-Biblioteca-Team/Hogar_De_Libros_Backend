import { ApiProperty } from '@nestjs/swagger';

export class ResponseHistoryDto {
  @ApiProperty({ description: 'Número de máquina' })
  workStation: number;

  @ApiProperty({ description: 'Nombre del usuario' })
  UserName: string;

  @ApiProperty({ description: 'Nombre del administrador que autorizó el uso' })
  AdminName: string;

  @ApiProperty({ description: 'Fecha y hora de inicio del uso' })
  LoanStartDate: Date;

  @ApiProperty({ description: 'Fecha y hora de fin del uso' })
  LoanExpireDate: Date;

  @ApiProperty({ description: 'Estado del préstamo' })
  Status: string;
}
