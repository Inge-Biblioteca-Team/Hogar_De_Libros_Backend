/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ComputerDTO {
  @ApiProperty({ example: 7 })
  @IsNumber()
  @IsNotEmpty()
  MachineNumber: number;

  @ApiProperty({ example: '8989A2' })
  @IsString()
  @IsNotEmpty()
  EquipmentSerial: string;

  @ApiProperty({ example: 'Samsung' })
  @IsString()
  EquipmentBrand: string;

  @ApiProperty({ example: 3 })
  @IsNumber()
  ConditionRating: number;

  @ApiProperty({ example: 'Golpes en la pantalla' })
  @IsString()
  Observation: string;

  @ApiProperty({ example: 'Monitor' })
  @IsString()
  @IsNotEmpty()
  EquipmentCategory: string;
}
