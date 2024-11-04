/* eslint-disable prettier/prettier */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBookChildrenDto {
  @ApiProperty({ example: 'Lazarillo de Tormes' })
  @IsString()
  @IsNotEmpty()
  Title: string;

  @ApiProperty({ example: 'Anonimo' })
  @IsString()
  @IsNotEmpty()
  Author: string;

  @IsOptional()
  @ApiPropertyOptional({ example: 'Editorial Universitaria Centroamericana Educa' })
  @IsString()
  Editorial: string;


  @ApiPropertyOptional({ example: '1997' })
  @IsNumber()
  PublishedYear: number;

  @IsOptional()
  @ApiPropertyOptional({ example: '9977-30-347-9' })
  @IsString()
  ISBN?: string;

  @ApiProperty({ example: 'Obras Literarias' })
  @IsString()
  ShelfCategory: string;

  @ApiPropertyOptional({ example: 'URL o Direccion Local' })
  @IsOptional()
  Cover?: string;

  @ApiProperty({ example: '8' })
  @IsNumber()
  BookConditionRating: number;
 
  @IsOptional()
  @ApiPropertyOptional({ description: 'Código de firma' })
  @IsString()
  SignatureCode?: string;
  
  @IsOptional()
  @ApiPropertyOptional({ example: '683251' })
  @IsString()
  InscriptionCode?: string;

  @ApiProperty({ example: '1 o 0 ' })
  @IsBoolean()
  ReserveBook: boolean;

  @IsOptional()
  @ApiPropertyOptional({ example: 'N/A ' })
  @IsString()
  Observations?: string;
}
