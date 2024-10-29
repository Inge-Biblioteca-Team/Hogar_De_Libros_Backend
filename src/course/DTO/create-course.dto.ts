/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsDate,
  IsInt,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateCourseDto {
  
  @ApiProperty({ description: 'Nombre del curso' })
  @IsString()
  @IsNotEmpty({ message: 'Nombre del curso es obligatorio' })
  courseName: string;
  
  @ApiProperty({ description: 'Fecha de inicio del curso' })
  @IsDate({ message: 'Fecha de inicio debe ser una fecha válida (DD-MM-YYYY)' })
  @IsNotEmpty({ message: 'Fecha de inicio es obligatorio' })
  date: string;

  @ApiProperty({ description: 'Hora del curso' })
  @IsString()
  @IsNotEmpty({ message: 'Hora del curso  es obligatorio' })
  courseTime: string;

  @ApiProperty({ description: 'Ubicación del curso' })
  @IsString({ message: 'Ubicacion debe ser un texto' })
  @IsNotEmpty({ message: 'Ubicacion es obligatorio' })
  location: string;

  @ApiProperty({ description: 'Persona a cargo del curso' })
  @IsString()
  @IsNotEmpty({ message: 'Persona a cargo es obligatorio' })
  instructor: string;

  @ApiProperty({ description: 'Tipo de curso' })
  @IsString({ message: 'Tipo de curso debe ser un texto' })
  @IsNotEmpty({ message: 'Tipo de curso es obligatorio' })
  courseType: string;

  @ApiProperty({ description: 'Edad objetivo del curso' })
  @IsInt({ message: 'Edad objetivo debe ser un número ' })
  @IsNotEmpty({ message: 'Edad objetivo es obligatorio' })
  targetAge: number;

  @ApiProperty({ description: 'Cupos disponibles para el curso' })
  @IsInt({ message: 'Capacidad debe ser un número ' })
  @IsNotEmpty({ message: 'Capacidad es obligatorio' })
  capacity: number;

  @ApiProperty({ description: 'Imagen representativa del curso' })
  @IsString({ message: 'grega el url' })
  @IsOptional()
  image?: string;

  @ApiProperty({ description: 'Duración del curso (por ejemplo, 2 horas)' })
  @IsString()
  @IsOptional()
  duration?: string;

  @ApiProperty({ description: 'Fecha final del curso' })
  @IsDate({ message: 'Fecha de finalizacion debe ser una fecha válida (DD-MM-YYYY)' })
  @IsNotEmpty({ message: 'Fecha de finalizacion es obligatorio' })
  endDate: string;

  @ApiProperty({ description: 'ID del programa', default: null })
  @IsNumber()
  @IsOptional()
  programProgramsId?: number;

  @ApiProperty({ description: 'Materiales necesarios', example: 'Lapiz' })
  @IsString()
  @IsOptional()
  materials?: string;
}
