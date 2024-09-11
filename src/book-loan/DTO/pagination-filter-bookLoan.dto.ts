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
  IsNumber,
  IsOptional,
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
    example: ['2024-01-01T00:00:00Z', '2024-12-31T23:59:59Z'],
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(2, { message: 'Debe proporcionar dos fechas para el rango de solicitud.' })
  @ArrayMaxSize(2, { message: 'El rango de fechas debe contener exactamente dos fechas.' })
  @IsDateString({}, { each: true, message: 'Cada fecha debe estar en formato ISO 8601.' })
  LoanRequestDateRange?: [string, string];

  @ApiPropertyOptional({
    description: 'Fecha de vencimiento del préstamo ',
    example: '2024-12-31T23:59:59Z',
  })
  @IsOptional()
  @IsDate({  })
  LoanExpirationDate?: Date;
  
  @ApiPropertyOptional({
    description: 'Fecha en la que se recoge el libro ',
    example: '2024-12-30T15:00:00Z',
  })
  @IsOptional()
  @IsDate()

  BookPickUpDate?: Date;

  @ApiPropertyOptional({
    description: 'Código del libro',
    example: '12345',
  })
  @IsOptional()
  @IsNumber({}, { message: 'El código del libro debe ser un número.' })
  bookBookCode?: number;

  @ApiPropertyOptional({
    description: 'Cédula del usuario (solo para préstamos finalizados)',
    example: '1234567890',
  })
  @IsOptional()
  @IsNumber({}, { message: 'La cédula debe ser un número.' })
  userId?: number;
}

