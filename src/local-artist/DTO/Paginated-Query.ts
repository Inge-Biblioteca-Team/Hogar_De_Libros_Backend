/* eslint-disable prettier/prettier */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class PaginatedQueryDTO {
  @ApiPropertyOptional({ description: 'Número de página', default: 1 })
  @IsInt()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({
    description: 'Cantidad por página',
    default: 10,
  })
  @IsInt()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({ description: 'Nombre del artista' })
  @IsString()
  @IsOptional()
  Name?: string;

  @ApiPropertyOptional({ description: 'Profesión del artista' })
  @IsString()
  @IsOptional()
  ArtisProfession?: string;

  @ApiPropertyOptional({ description: 'Estado' })
  @IsNumber()
  @IsOptional()
  Actived?: number;
}
