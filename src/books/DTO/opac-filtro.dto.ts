import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt } from 'class-validator';

export class OpacFiltroDto {
  @ApiPropertyOptional({ description: 'Título del libro' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Categoría del libro' })
  @IsOptional()
  @IsString()
  shelfCategory?: string;

  @ApiPropertyOptional({ description: 'Autor del libro' })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiPropertyOptional({ description: 'Año de publicación' })
  @IsOptional()
  @IsInt()
  publishedYear?: number;

  year:number;
}
