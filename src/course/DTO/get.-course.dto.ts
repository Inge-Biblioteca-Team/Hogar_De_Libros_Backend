/* eslint-disable prettier/prettier */

import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsInt, Min } from "class-validator";

export class GetCoursesDto {
  
  @ApiPropertyOptional({ description: 'Número de página', default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({
    description: 'Cantidad de libros por página',
    default: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number;
}
