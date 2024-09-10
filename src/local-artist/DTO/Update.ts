/* eslint-disable prettier/prettier */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateLocalArtistDTO {
  @ApiPropertyOptional({ description: 'Profeción del artista' })
  @IsOptional()
  @IsString()
  ArtisProfession?: string;

  @ApiPropertyOptional({ description: 'URL de la foto' })
  @IsOptional()
  @IsString()
  Cover?: string;

  @ApiPropertyOptional({ description: 'Menciones y Demás' })
  @IsOptional()
  @IsString()
  MoreInfo?: string;

  @ApiPropertyOptional({ description: 'Red FB' })
  @IsOptional()
  @IsString()
  FBLink?: string;

  @ApiPropertyOptional({ description: 'Red IG' })
  @IsOptional()
  @IsString()
  IGLink?: string;

  @ApiPropertyOptional({ description: 'Red LI' })
  @IsOptional()
  @IsString()
  LILink?: string;
}
