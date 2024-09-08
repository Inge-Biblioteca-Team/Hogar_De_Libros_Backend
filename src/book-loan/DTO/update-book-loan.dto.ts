import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdateBookLoanStatusAcceptedDto {
    @ApiProperty({ description: 'Nuevo estado del préstamo', example: 'Aceptado' })
    @IsString()
    Status: string;
   
  }