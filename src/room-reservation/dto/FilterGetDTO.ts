/* eslint-disable prettier/prettier */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  Min,
  IsString,
  IsNumber,
} from 'class-validator';

export class FilterGetDTO {
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

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Fecha a Consultar' })
  date: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Nombre de la institucion' })
  name: string;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Nombre de la institucion' })
  roomId: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Estados (Finalizado, Aprovado y Pendiente)' })
  reserveStatus?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Cedula del usuario que realizo la reserva' })
  userCedula?: string;


}
