/* eslint-disable prettier/prettier */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class PaginatedDTO {
  @ApiPropertyOptional({ description: 'Número de página', default: 1 })
  @IsInt()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({
    description: 'Cantidad por página',
    default: 10,
  })
  @IsInt()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  limit?: number;
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Nombre completo' })
  Description?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Nombre completo' })
  Location?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Nombre completo' })
  InChargePerson?: string;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Nombre completo' })
  ConditionRating?: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'SE NA o BAJA' })
  Status?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'SE NA o BAJA' })
  LicenseNumber: string;
}
