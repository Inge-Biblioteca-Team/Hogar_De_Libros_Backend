/* eslint-disable prettier/prettier */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class PaginationFilterChildrenDto {
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
    description: 'Filtrar por Estado (habilitado o deshabilitado)'
  })
  @IsNumber()
  @IsOptional()
  Status: number;

  @ApiPropertyOptional({ description: 'Filtrar por Categoría del Estante' })
  @IsOptional()
  @IsString()
  ShelfCategory?: string;

  @ApiPropertyOptional({ description: 'Filtrar por Año de publicación' })
  @IsOptional()
  @IsNumber()
  PublishedYear?: number;

  @ApiPropertyOptional({ description: 'Filtrar por Editorial del libro' })
  @IsOptional()
  @IsString()
  Editorial: string;

  @ApiPropertyOptional({ description: 'Filtrar solo libres' })
  @IsOptional()
  @IsString()
  lib: string;
}
