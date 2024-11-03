/* eslint-disable prettier/prettier */

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ChangeLoanStatus {
  @ApiProperty({ description: 'Id del préstamo:' })
  LoanID: number;
  @ApiProperty({ description: 'Acepta o recibe:' })
  person: string;
  @ApiPropertyOptional({ description: 'Observaciones al finalizar el préstamo' })
  Observations?: string;
}
