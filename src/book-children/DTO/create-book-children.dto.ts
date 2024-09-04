/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBookChildrenDto {
  @ApiProperty({ example: 'Lazarillo de Tormes' })
  @IsString()
  @IsNotEmpty()
  Title: string;

  @ApiProperty({ example: 'Anonimo' })
  @IsString()
  @IsNotEmpty()
  Author: string;

  @ApiProperty({ example: 'Editorial Universitaria Centroamericana Educa' })
  @IsString()
  Editorial: string;

  @ApiProperty({ example: '1997' })
  @IsNumber()
  PublishedYear: number;

  @ApiProperty({ example: '9977-30-347-9' })
  @IsString()
  ISBN: string;

  @ApiProperty({ example: 'Obras Literarias' })
  @IsString()
  ShelfCategory: string;

  @ApiProperty({ example: 'URL o Direccion Local' })
  @IsString()
  Cover: string;

  @ApiProperty({ example: '8' })
  @IsNumber()
  BookConditionRating: number;

  @ApiProperty({ example: '4' })
  @IsString()
  SignatureCode: string;

  @ApiProperty({ example: '683251' })
  @IsString()
  InscriptionCode: string;

  @ApiProperty({ example: '1 o 0 ' })
  @IsBoolean()
  ReserveBook: boolean;

  @ApiProperty({ example: 'N/A ' })
  @IsString()
  Observations: string;
}
