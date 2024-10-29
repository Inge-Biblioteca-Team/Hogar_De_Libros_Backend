/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min, Max, IsOptional } from 'class-validator';

export class ComputerDTO {
  @ApiProperty({ example: 7, description: 'Número de máquina, debe ser único y numérico' })
  @IsNumber({}, { message: 'Número de máquina debe ser un número' })
  @IsNotEmpty({ message: 'Número de máquina es un campo obligatorio' })
  MachineNumber: number;

  @ApiProperty({ example: '8989A2', description: 'Número de serie del equipo' })
  @IsString()
  @IsNotEmpty({ message: 'Serial es un campo obligatorio' })
  EquipmentSerial: string;

  @ApiProperty({ example: 'Samsung', description: 'Marca del equipo' })
  @IsString()
  @IsNotEmpty({ message: ' Marca del equipo es un campo obligatorio' })
  EquipmentBrand?: string;

  @ApiProperty({ example: 3, description: 'Condición del equipo, de 1 a 5' })
  @IsNumber({}, { message: 'Rango de condicion debe ser un número' })
  @IsOptional()
  ConditionRating?: number;

  @ApiProperty({ example: 'Golpes en la pantalla', description: 'Observación sobre el estado del equipo' })
  @IsString()
  @IsOptional()
  Observation?: string;

  @ApiProperty({ example: 'Monitor', description: 'Categoría del equipo' })
  @IsString()
  @IsNotEmpty({ message: 'Categoria del equipo es un campo obligatorio' })
  EquipmentCategory: string;
}
