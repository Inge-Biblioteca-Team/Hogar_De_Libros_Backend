/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '1' })
  roomNumber: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Sala de conferencias' })
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 100 })
  area: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 50 })
  capacity: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Una sala grande con proyector para dar conferencias',
  })
  observations?: string;

  @IsNotEmpty({message:"Por favor añadir por lo menos una imagen de la sala"})
  @ApiProperty({ example: ['URL de la imagen de la sala'] })
  image?: string[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Biblioteca publica municipal de Nicoya' })
  location: string;
}
