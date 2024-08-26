import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBookDto {

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
  @IsNumber()
  ISBN: string;
   
  @ApiProperty({ example: 'Obras Literarias' })
  @IsString()
  ShelfCategory: string;

  @ApiProperty({ example: 'c:\Users\Maria Paula\Documents\Lazarillo.jpg' })
  @IsString()
  Cover: string;

  @ApiProperty({ example: '8' })
  @IsNumber()
  BookConditionRating: number;

  @ApiProperty({ example: '4' })
  @IsNumber()
  ShelfNumber: number;

  @ApiProperty({ example: '4' })
  @IsNumber()
  SignatureCode:string;

  
  @ApiProperty({ example: '683251' })
  @IsNumber()
  InscriptionCode:number;

  @ApiProperty({ example: 'no ' })
  @IsBoolean()
  Reserva :boolean;

  @ApiProperty({ example: 'si ' })
  @IsBoolean()
  Status :boolean;

}