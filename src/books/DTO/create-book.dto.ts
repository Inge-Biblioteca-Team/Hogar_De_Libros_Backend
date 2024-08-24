import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBookDto {

 @ApiProperty({ example: '863.6L431L2' })
 @IsString()
 @IsNotEmpty()
 BookCode: string;

 

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
  ISBN: number;
   
  @ApiProperty({ example: 'Obras Literarias' })
  @IsString()
  BookCategory: string;

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
  SignatureCode:number;

  
  @ApiProperty({ example: '683251' })
  @IsNumber()
  InscriptionCode:number;

  @ApiProperty({ example: '4' })
  @IsBoolean()
  Reserva :boolean;



}