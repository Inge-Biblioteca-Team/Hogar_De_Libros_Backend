/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateProgramDto {
  @ApiProperty({ description: 'Nombre del programa' })
  @IsString()
  programName: string;

  @ApiProperty({ description: 'Descripción del programa' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Image' })
  @IsOptional()
  @IsString()
  image?: string;
}
