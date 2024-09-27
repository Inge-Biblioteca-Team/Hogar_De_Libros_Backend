/* eslint-disable prettier/prettier */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, IsString } from 'class-validator';

export class SeachDTO {
  @ApiPropertyOptional({ description: 'Número de página', default: 1 })
  @IsInt()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({
    description: 'Resultados Por pagina',
    default: 10,
  })
  @IsInt()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  limit?: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Cedula Del Usuario' })
  category: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Mes del curso' })
  month?: string;
}
