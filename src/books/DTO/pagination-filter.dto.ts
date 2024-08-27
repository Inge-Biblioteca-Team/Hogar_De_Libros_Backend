import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export enum BookStatus {
  Enabled = 'enabled',
  Disabled = 'disabled',
}

export class PaginationFilterDto {
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

  @ApiPropertyOptional({ description: 'Filtrar por Titulo' })
  @IsOptional()
  @IsString()
  Title: string;

  @ApiPropertyOptional({ description: 'Filtrar por ISBN' })
  @IsOptional()
  @IsString()
  ISBN?: string;

  @ApiPropertyOptional({ description: 'Filtrar por Autor' })
  @IsOptional()
  @IsString()
  Author?: string;

  @ApiPropertyOptional({ description: 'Filtrar por Código de Firma' })
  @IsOptional()
  @IsString()
  SignatureCode?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por Estado (habilitado o deshabilitado)',
    default: true,
  })
  @IsNumber()
  @IsOptional()
  Status: number;

  @ApiPropertyOptional({ description: 'Filtrar por Categoría del Estante' })
  @IsOptional()
  @IsString()
  ShelfCategory?: string; 
}
