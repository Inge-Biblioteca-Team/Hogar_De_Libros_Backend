import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdateBookLoanStatusDto {
    @ApiProperty({ description: 'Nuevo estado del préstamo', example: 'Aceptado' })
    @IsString()
    Status: string;
  }