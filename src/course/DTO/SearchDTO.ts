/* eslint-disable prettier/prettier */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class SearchDTO {
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

  @IsInt()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Cedula Del Usuario' })
  userCedula?: number;

  @IsInt()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Numero de máquina de equipo de cómputo',
  })
  date?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Nombre y Tipo de Curso' })
  courseType?: string;

  @IsInt()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Edad Objetivo' })
  targetAge?: string;

}
