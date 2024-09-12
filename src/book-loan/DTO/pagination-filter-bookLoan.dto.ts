/* eslint-disable prettier/prettier */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDate,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Min,
 
} from 'class-validator';


export class PaginationFilterBookLoanDto {

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
    description: 'Rango de fechas de solicitud de préstamo (formato ISO 8601)',
    example: ['2024-01-01', '2024-12-31'],
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(2, { message: 'Debe proporcionar dos fechas para el rango de solicitud.' })
  @ArrayMaxSize(2, { message: 'El rango de fechas debe contener exactamente dos fechas.' })
  @IsDateString({}, { each: true })
  LoanRequestDateRange?: [string, string];

  @ApiPropertyOptional({
    description: 'Fecha de vencimiento del préstamo ',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDate({  })
  LoanExpirationDate?: Date;
  
  @ApiPropertyOptional({
    description: 'Fecha en la que se recoge el libro ',
    example: '2024-12-30',
  })
  @IsOptional()
  @IsDate()

  BookPickUpDate?: Date;

  @ApiPropertyOptional({
    description: 'Código del libro',
  })
  @IsOptional()
  @IsString({ message: 'Añada el codigo.' })
  signatureCode?: string;

  @ApiPropertyOptional({
    description: 'Cédula del usuario (solo para préstamos finalizados)',
  })
  @IsOptional()
  @IsString( { message: 'Agregar el numero de cedula.' })
  cedula?: string;
}

