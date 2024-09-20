/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateFurnitureDto {
  @IsString()
  @ApiProperty({ description: 'Nombre del objeto' })
  Description: string;

  @IsString()
  @ApiProperty({ description: 'Ubicacion del Mobiliario' })
  Location: string;

  @IsString()
  @ApiProperty({ description: 'Nombre completo de la persona acargo' })
  InChargePerson: string;

  @IsNumber()
  @ApiProperty({ description: 'COndicion del 1-5' })
  ConditionRating: number;

  @IsString()
  @ApiProperty({description: "Numero de Placa del Elemento"})
  LicenseNumber:string
}
