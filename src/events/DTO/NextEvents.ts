/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class NexEventsDTO {
  @ApiProperty({ description: 'Número de Curso' })
  id: number;

  @ApiProperty({ description: 'Nombre del curso' })
  eventType: string;

  @ApiProperty({ description: 'Imagen del curso' })
  image?: string;

  @ApiProperty({ description: 'Impartido Por' })
  instructor: string;

  @ApiProperty({ description: 'Lugar' })
  location: string;

  @ApiProperty({ description: 'Fecha de inicio' })
  date: Date;

  @ApiProperty({ description: 'Fecha de inicio' })
  eventTime: string;

  @ApiProperty({ description: 'Edad Objetivo' })
  objetiveAge: string;

  @ApiProperty({ description: 'Edad Objetivo' })
  status: string;

  @ApiProperty({ description: 'Edad Objetivo' })
  details: string;

  @ApiProperty({ description: 'Edad Objetivo' })
  title: string;
}
