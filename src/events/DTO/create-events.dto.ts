/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsNotEmpty,
  IsString,
  IsOptional,
} from 'class-validator';

export class CreateEventsDTO {
  
  @ApiProperty({ example: 'Parque recadero Briceño' })
  @IsString()
  @IsNotEmpty({ message: 'Location es un campo obligatorio' })
  Location: string;

  @ApiProperty({ example: 'Charla de lectura' })
  @IsString()
  @IsNotEmpty({ message: 'Title es un campo obligatorio' })
  Title: string;

  @ApiProperty({
    example: 'Evento de charla sobre la importancia de la lectura',
  })
  @IsString()
  @IsNotEmpty({ message: 'Details es un campo obligatorio' })
  Details: string;

  @ApiProperty({ example: 'Charla' })
  @IsString()
  @IsNotEmpty({ message: 'Category es un campo obligatorio' })
  Category: string;

  @ApiProperty({ example: '10-10-2021' })
  @IsDate({ message: 'Date debe ser una fecha en formato DD-MM-YYYY' })
  @IsNotEmpty({ message: 'Date es un campo obligatorio' })
  Date: Date;

  @ApiProperty({ example: '10:00:00' })
  @IsString()
  @IsNotEmpty({ message: 'Time es un campo obligatorio' })
  Time: string;

  @ApiProperty({ example: 'URL de la imagen del evento' })
  @IsOptional()
  @IsString()
  Image?: string;

  @ApiProperty({ example: 'Niños de 5 a 10 años' })
  @IsString()
  @IsNotEmpty({ message: 'TargetAudience es un campo obligatorio' })
  TargetAudience: string;

  @ApiProperty({ example: 'Juan Perez' })
  @IsString()
  @IsNotEmpty({ message: 'InchargePerson es un campo obligatorio' })
  InchargePerson: string;
}
