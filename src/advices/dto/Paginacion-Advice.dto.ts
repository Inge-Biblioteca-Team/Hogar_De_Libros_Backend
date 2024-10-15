/* eslint-disable prettier/prettier */

import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsDate,
  IsOptional,
  IsInt,
  IsPositive,
} from 'class-validator';

export class Paginacion_AdviceDTO {
  @ApiPropertyOptional({ description: 'Numero de pagina' })
  @IsOptional()
  @IsInt()
  @IsPositive()
  page?: number;

  @ApiPropertyOptional({ description: 'Resultados por pagina' })
  @IsOptional()
  @IsInt()
  @IsPositive()
  limit?: number;

  @ApiPropertyOptional({ description: 'Razón del aviso' })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional({ description: 'Categoría del aviso' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Fecha del aviso formato yyyy-mm-dd' })
  @IsOptional()
  @IsDate()
  date?: Date;
}
