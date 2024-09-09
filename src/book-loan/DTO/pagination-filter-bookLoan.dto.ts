import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsInt, IsNumber, IsOptional, IsString, Min } from "class-validator";

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

    @ApiPropertyOptional({ description: 'Fecha inicial del rango de solicitud', type: Date })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    LoanRequestDate?: Date;
    
    @ApiPropertyOptional({ description: 'Fecha final del rango de solicitud', type: Date })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    LoanRequestEndDate?: Date; 

    @ApiPropertyOptional({ description: 'Fecha de entrega del libro', type: Date })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    BookPickUpDate?: Date;

    @ApiPropertyOptional({ description: 'Fecha de expiración del préstamo', type: Date })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    LoanExpirationDate?: Date;

    @ApiPropertyOptional({ description: 'Código de signatura' })
    @IsOptional()
    @IsString()
    SignatureCode?: string;
  
    @ApiPropertyOptional({ description: 'Cédula (solo para préstamos finalizados)' })
    @IsOptional()
    @IsNumber()
    Cedula?: number;
    }