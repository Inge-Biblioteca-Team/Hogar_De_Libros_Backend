/* eslint-disable prettier/prettier */
import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindAllUsersDto {
  @ApiPropertyOptional({ description: 'Número de página', default: 1 })
  @Type(() => Number)
  @IsNumber()
  page: number;

  @ApiPropertyOptional({ description: 'Tamaño de Pagina', default: 5 })
  @Type(() => Number)
  @IsNumber()
  limit: number;

  @ApiPropertyOptional({ description: 'Nombre del Usuario'})
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Cedula del Usuario' })
  @IsOptional()
  @IsString()
  cedula?: string;

  @ApiPropertyOptional({ description: 'Rol' })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional({ description: 'Año de Registro' })
  @IsOptional()
  @IsDateString()
  registerDate?: string;


  loanPolicy:number
}
