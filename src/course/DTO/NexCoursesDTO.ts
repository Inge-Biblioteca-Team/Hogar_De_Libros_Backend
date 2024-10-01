/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class NexCorusesDTO {
  @ApiProperty({ description: 'Número de Curso' })
  Id: number;

  @ApiProperty({ description: 'Nombre del curso' })
  courseType: string;
  @ApiProperty({ description: 'Nombre del curso' })
  courseName: string;

  @ApiProperty({ description: 'Imagen del curso' })
  image?: string;

  @ApiProperty({ description: 'Campos Disponibles' })
  avaibleQuota: number;

  @ApiProperty({ description: 'Capacidad Maxima' })
  capacity: number;

  @ApiProperty({ description: 'Lugar' })
  location: string;

  @ApiProperty({ description: 'Fecha de inicio' })
  Date: Date;

  @ApiProperty({ description: 'Fecha de inicio' })
  CourseTime: string;

  @ApiProperty({ description: 'Fecha de inicio' })
  EndDate: Date;

  @ApiProperty({ description: 'Impartido Por' })
  instructor: string;

  @ApiProperty({ description: 'Edad Objetivo' })
  objetiveAge: number;

  @ApiProperty({ description: 'Edad Objetivo' })
  duration: string;

  @ApiProperty({description:"Materiales del curso"})
  materials:string;
}
