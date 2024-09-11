/* eslint-disable prettier/prettier */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginationQueryDTO {
  @ApiPropertyOptional({ description: 'Número de página', default: 1 })
  @IsInt()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  Page?: number;

  @ApiPropertyOptional({
    description: 'Cantidad de equipo de computo por página',
    default: 10,
  })
  @IsInt()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  Limit?: number;
}
