/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateLocalArtistDTO {
  @IsString()
  @ApiProperty({ description: 'Nombre completo' })
  Name: string;

  @IsString()
  @ApiProperty({ description: 'Profecion Pintor Cantante o otro' })
  ArtisProfession: string;

  @IsString()
  @ApiProperty({ description: 'Url' })
  Cover: string;

  @IsString()
  @ApiProperty({ description: 'Menciones y Demas' })
  MoreInfo: string;

  @IsString()
  @ApiProperty({ description: 'Red FB' })
  FBLink: string;

  @IsString()
  @ApiProperty({ description: 'Red IG' })
  IGLink: string;

  @IsString()
  @ApiProperty({ description: 'Red LI' })
  LILink: string;
}
