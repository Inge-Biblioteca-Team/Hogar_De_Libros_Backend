import { IsArray, IsOptional, IsString, ArrayNotEmpty, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrUpdateFriendLibraryDTO {
  @ApiProperty({ example: '1234567890' })
  @IsString()
  @IsNotEmpty()
  cedula: string; // Para buscar al usuario

  @ApiProperty({ example: ['tecnico', 'lector'] })
  @IsArray()
  @IsNotEmpty()
  @ArrayNotEmpty()
  @IsString({ each: true }) // Validamos que cada elemento sea string
  principalCategory: string[]; // Categorías principales

  @ApiProperty({ example: ['cuenta ', 'cuentos'] })
  @IsArray()
  @IsNotEmpty()
  @ArrayNotEmpty()
  @IsString({ each: true }) // Validamos que cada subcategoría sea string
  subCategory: string[]; // Subcategorías

  @ApiProperty({ example: ['URL1 ', 'URL2'] })
  @IsOptional()
  @IsArray()
  @Type(() => String) // Aceptamos un array que puede contener strings (para textos o nombres de archivos)
  document?: (string | Express.Multer.File)[]; // Puede ser un array de strings o archivos
}
