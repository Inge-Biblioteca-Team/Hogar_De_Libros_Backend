import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';

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

  
  @ApiPropertyOptional({ description: 'Número de página', default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Cantidad de resultados por página', default: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
