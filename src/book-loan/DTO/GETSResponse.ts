/* eslint-disable prettier/prettier */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class GETResponseDTO {
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

  @ApiPropertyOptional({
    description: 'Fecha de INICIO',
  })
  @IsOptional()
  @IsDate({})
  StartDate?: Date;
  @ApiPropertyOptional({
    description: 'Fecha de FIN ',
  })
  @IsOptional()
  @IsDate({})
  EndDate?: Date;

  @ApiPropertyOptional({
    description: 'Fecha de vencimiento del préstamo ',
  })
  @IsOptional()
  @IsDate({})
  LoanExpirationDate?: Date;

  //GET PARA EN PROGRESO
  @ApiPropertyOptional({
    description: 'Fecha en la que se recoge el libro ',
  })
  @IsOptional()
  @IsDate()
  BookPickUpDate?: Date;

  //GETS Finalizados
  @ApiPropertyOptional({
    description: 'Cédula del usuario (solo para préstamos finalizados)',
  })
  @IsOptional()
  @IsString({ message: 'Agregar el Nombre del solicitante.' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Código del libro',
  })
  @IsOptional()
  @IsString({ message: 'Añada el codigo.' })
  signatureCode?: string;

  @IsOptional()
  @IsString({message:"Cedula"})
  cedula:string
}
