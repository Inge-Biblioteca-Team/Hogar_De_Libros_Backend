/* eslint-disable prettier/prettier */

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class ChangeLoanStatus {
  @ApiProperty({ description: 'Id del préstamo:' })
  @IsNumber()
  LoanID: number;
  @ApiProperty({ description: 'Acepta o recibe:' })
  @IsString()
  person: string;
  @ApiPropertyOptional({ description: 'Observaciones al finalizar el préstamo' })
  @IsOptional()
  @IsString()
  Observations?: string;
}
