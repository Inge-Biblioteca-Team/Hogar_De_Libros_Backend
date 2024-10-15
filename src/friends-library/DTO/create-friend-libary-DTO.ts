import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFriendDTO {
  @ApiProperty({ description: 'Cédula del usuario', example: '123456789' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  cedula: string;

  @ApiProperty({ description: 'Categoría principal', example: 'Voluntariado' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  principalCategory: string;

  @ApiProperty({ description: 'Subcategoría', example: 'Donación' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  subCategory: string;

  @ApiProperty({
    description: 'Documentos',
    example: ['documento1', 'documento2'],
  })
  @IsOptional()
  document?: string[];

  @ApiProperty({ description: 'Imágenes', example: ['imagen1', 'imagen2'] })
  @IsOptional()
  image: string[];

  @ApiProperty({
    description: 'Fecha de recoleccion del donativo',
    example: '2024-10-15',
  })
  @IsOptional()
  @IsDate()
  DateRecolatedDonation?: Date;
}
