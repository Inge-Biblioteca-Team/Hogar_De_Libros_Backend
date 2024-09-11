/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateFurnitureDto {
  @IsString()
  @ApiProperty({ description: 'Nombre completo' })
  Description: string;

  @IsString()
  @ApiProperty({ description: 'Nombre completo' })
  Location: string;

  @IsString()
  @ApiProperty({ description: 'Nombre completo' })
  InChargePerson: string;

  @IsNumber()
  @ApiProperty({ description: 'Nombre completo' })
  ConditionRating: number;
}
