/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUrl, IsOptional } from 'class-validator';

export class CreateLocalArtistDTO {
  
  @IsString()
  @IsNotEmpty({ message: 'Nombre completo del artista es obligatorio' })
  @ApiProperty({ description: 'Nombre completo del artista' })
  Name: string;

  @IsString()
  @IsNotEmpty({ message: 'Profesión del artista es obligatorio' })
  @ApiProperty({ description: 'Profesión del artista (ej. Pintor, Cantante)' })
  ArtisProfession: string;

  @IsString()
  @IsUrl({}, { message: ' URL de la imagen de portada del artista debe ser una URL válida' })
  @IsOptional()
  @ApiProperty({ description: 'URL de la imagen de portada del artista', example: 'http://example.com/image.jpg' })
  Cover: string;

  @IsString({ message: 'MoreInfo debe ser una cadena de texto' })
  @IsOptional()
  @ApiProperty({ description: 'Menciones y otra información adicional sobre el artista' })
  MoreInfo: string;

  @IsString()
  @IsUrl({}, { message: 'FBLink debe ser una URL válida' })
  @IsOptional()
  @ApiProperty({ description: 'Enlace a Facebook del artista' })
  FBLink: string;

  @IsString()
  @IsUrl({}, {  message: 'La URL debe ser una URL válida'  })
  @IsOptional()
  @ApiProperty({ description: 'Enlace a Instagram del artista' })
  IGLink: string;

  @IsString()
  @IsUrl({}, { message: 'La URL debe ser una URL válida' })
  @IsOptional()
  @ApiProperty({ description: 'Enlace a LinkedIn del artista' })
  LILink: string;
}
