import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class PaginationQueryDTO {
  @ApiPropertyOptional({ description: 'Cantidad de equipo de computo por página', default: 10 })
  @IsInt()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  Limit?: number;
  
  @ApiPropertyOptional({ description: 'Número de página', default: 1 })
  @IsInt()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  Page?: number;

  @IsInt()
  @IsOptional()
  @ApiPropertyOptional({description: 'Código único de equipo de cómputo'})
  EquipmentUniqueCode?: number;

  @IsInt()
  @IsOptional()
  @ApiPropertyOptional({description: 'Numero de máquina de equipo de cómputo'})
  MachineNumber?: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({description: 'Marca del equipo de cómputo'})
  EquipmentBrand?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({description: 'Categoria del equipo de cómputo'})
  EquipmentCategory?: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({description: 'Estado del equipo de cómputo'})
  Status?: boolean;
}
