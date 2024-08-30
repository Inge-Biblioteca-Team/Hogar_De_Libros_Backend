import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

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
  @IsNotEmpty()
  EquipmentBrand: string;

  @ApiProperty({ example: 3 })
  @IsNumber()
  @IsNotEmpty()
  ConditionRating: number;

  @ApiProperty({ example: 'Golpes en la pantalla' })
  @IsString()
  @IsNotEmpty()
  Observation: string;

  @ApiProperty({ example: 'Monitor' })
  @IsString()
  @IsNotEmpty()
  EquipmentCategory: string;

  @ApiProperty({example: true})
  @IsBoolean()
  Status: boolean;
}
