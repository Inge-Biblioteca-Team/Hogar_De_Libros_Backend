/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdateBookLoanStatusAcceptedDto {
    @ApiProperty({ description: 'Nuevo estado del préstamo', default:'En Proceso'})
    @IsString()
    Status: string;
   
  }