/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsDate,
  IsInt,
  IsNumber,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({ description: 'Nombre del curso' })
  @IsString()
  @IsNotEmpty()
  courseName: string;
  @ApiProperty({ description: 'Fecha de inicio del curso' })
  @IsDate()
  @IsNotEmpty()
  date: Date;

  @ApiProperty({ description: 'Hora del curso' })
  @IsString()
  @IsNotEmpty()
  courseTime: string;

  @ApiProperty({ description: 'Ubicación del curso' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ description: 'Persona a cargo del curso' })
  @IsString()
  @IsNotEmpty()
  instructor: string;

  @ApiProperty({ description: 'Nombre del curso' })
  @IsString()
  @IsNotEmpty()
  courseType: string;

  @ApiProperty({ description: 'Edad objetivo del curso' })
  @IsInt()
  @IsNotEmpty()
  targetAge: number;

  @ApiProperty({ description: 'Cupos disponibles para el curso' })
  @IsInt()
  @IsNotEmpty()
  capacity: number;

  @ApiProperty({ description: 'Imagen representativa del curso' })
  @IsString()
  image: string;

  @ApiProperty({ description: 'Duración del curso (por ejemplo, 2 horas)' })
  @IsString()
  duration: string;

  @ApiProperty({ description: 'Fecha final del curso' })
  @IsDate()
  @IsNotEmpty()
  endDate: Date;

  @ApiProperty({ description: 'Id Programa' })
  @IsNumber()
  @IsOptional()
  programProgramsId: number;
  
}
