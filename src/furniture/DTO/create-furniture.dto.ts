/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsNotEmpty, Min, Max } from 'class-validator';

export class CreateFurnitureDto {

  @IsString()
  @IsNotEmpty({ message: 'Descripcion  es obligatorio' })
  @ApiProperty({ description: 'Nombre del objeto' })
  Description: string;

  @IsString()
  @IsNotEmpty({ message: 'Ubicacion es obligatorio' })
  @ApiProperty({ description: 'Ubicación del Mobiliario' })
  Location: string;

  @IsString()
  @IsNotEmpty({ message: 'Nombre completo de la persona a cargo es obligatorio' })
  @ApiProperty({ description: 'Nombre completo de la persona a cargo' })
  InChargePerson: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Condición  es obligatorio' })
  @ApiProperty({ description: 'Condición , de 1 a 5' })
  ConditionRating: number;

  @IsString()
  @IsNotEmpty({ message: 'Número de placa  es obligatorio' })
  @ApiProperty({ description: 'Número de placa del elemento' })
  LicenseNumber: string;
}
