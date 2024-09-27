/* eslint-disable prettier/prettier */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class PaginationEventsDTO {
  @ApiPropertyOptional({ description: 'Número de página', default: 1 })
  @IsInt()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  Page?: number;

  @ApiPropertyOptional({
    description: 'Cantidad de eventos por página',
    default: 10,
  })
  @IsInt()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  Limit?: number;

  @ApiPropertyOptional({
    description: 'Estado del evento (P,F o E)',
  })
  @IsString()
  @IsOptional()
  Status: string;

  @ApiPropertyOptional({ description: 'Titulo del evento' })
  @IsString()
  @IsOptional()
  Title: string;

  @ApiPropertyOptional({ description: 'Audiencia objetiva del evento' })
  @IsString()
  @IsOptional()
  TargetAudience: string;

  @ApiPropertyOptional({ description: 'Category del evento' })
  @IsString()
  @IsOptional()
  category: string;

  @ApiPropertyOptional({
    description: 'Fecha de inicio de rango de busqueda (YYYY-MM-DD)',
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  StartDate?: Date;

  @ApiPropertyOptional({
    description: 'Fecha de inicio de rango de busqueda (YYYY-MM-DD)',
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  EndDate?: Date;
}
