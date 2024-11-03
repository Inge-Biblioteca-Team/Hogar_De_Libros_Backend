/* eslint-disable prettier/prettier */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUrl, IsOptional } from 'class-validator';

export class CreateLocalArtistDTO {
  
  @IsNotEmpty({ message: 'Nombre completo del artista es obligatorio' })
  @IsString()
  @ApiProperty({ description: 'Nombre completo del artista' })
  Name: string;

  @IsNotEmpty({ message: 'Profesión del artista es obligatorio' })
  @IsString()
  @ApiProperty({ description: 'Profesión del artista (ej. Pintor, Cantante)' })
  ArtisProfession: string;

  @IsOptional()
  @ApiPropertyOptional({ description: 'URL de la imagen de portada del artista', example: 'http://example.com/image.jpg' })
  @IsString()
  Cover: string;

  @IsOptional()
  @ApiPropertyOptional({ description: 'Menciones y otra información adicional sobre el artista' })
  @IsString({ message: 'MoreInfo debe ser una cadena de texto' })
  MoreInfo?: string;

  @IsOptional()
  @ApiPropertyOptional({ description: 'Enlace a Facebook del artista' })
  @IsString()
  FBLink?: string;

  @IsOptional()
  @ApiPropertyOptional({ description: 'Enlace a Instagram del artista' })
  @IsString()
  IGLink?: string;

  @IsOptional()
  @ApiPropertyOptional({ description: 'Enlace a LinkedIn del artista' })
  @IsString()
  LILink?: string;
}
