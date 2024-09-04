/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean } from "class-validator";

export class EnableBookChildrenDto {
    @ApiProperty({ description: 'Estado del libro, true para habilitar' })
    @IsBoolean({ message: 'Status must be a boolean value' })
    Status: boolean = true; 
  }