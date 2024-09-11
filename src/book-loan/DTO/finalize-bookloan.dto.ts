/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";

export class FinalizeBookLoanDto {
    @ApiProperty({ description: 'Observaciones al finalizar el préstamo' })
    Observations: string;
}