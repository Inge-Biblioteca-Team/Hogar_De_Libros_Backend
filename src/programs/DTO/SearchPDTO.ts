/* eslint-disable prettier/prettier */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, IsString } from 'class-validator';

export class SearchPDTO {
  @ApiPropertyOptional({ description: 'Número de página', default: 1 })
  @IsInt()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({ description: 'Número de página', default: 5 })
  @IsInt()
  @IsOptional()
  @Min(5)
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Resultados Por pagina',
  })
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Cedula Del Usuario' })
  programName: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Estado Del Curso' })
  status: string;
}
