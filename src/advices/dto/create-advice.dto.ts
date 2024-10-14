/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsDate, IsOptional, IsString } from 'class-validator';

export class CreateAdviceDto {
  @IsString()
  @ApiProperty({
    description: 'Razón del aviso',
    example: 'Curso de programación',
  })
  @IsNotEmpty({ message: 'La razón del aviso no puede estar vacía.' })
  reason: string;

  @IsNotEmpty({ message: 'El dia de la actividad no puede estar vacío.' })
  @ApiProperty({
    description: 'Fecha del aviso',
    example: '2025-10-14',
  })
  @Type(() => Date) 
  @IsDate()
  date: Date;

  @IsString()
  @ApiProperty({
    description: 'Imagen del aviso',
    example: 'https://ejemplo.com/imagen.jpg',
  })
  @IsNotEmpty({ message: 'La imagen no puede estar vacía.' })
  image: string;

  @IsString()
  @ApiProperty({
    description: 'Información adicional del aviso',
    example: 'Detalles adicionales sobre el aviso.',
  })
  @IsOptional()
  extraInfo: string;

  @IsString()
  @ApiProperty({
    description: 'Categoría del aviso',
    example: 'Evento',
  })
  @IsNotEmpty({ message: 'La categoría no puede estar vacía.' })
  category: string;
}
