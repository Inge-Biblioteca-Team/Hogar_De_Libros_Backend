/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRoomReservationDto {
  @ApiProperty({ description: 'Nombre de la institución' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Fecha de emisión' })
  @IsDate()
  @IsNotEmpty()
  date: Date;

  @ApiProperty({ description: 'Hora de inicio' })
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({ description: 'Hora de finalización' })
  @IsString()
  @IsNotEmpty()
  endTime: string;

  @ApiProperty({ description: 'Observaciones adicionales' })
  @IsString()
  @IsOptional()
  observations: string;

  @ApiProperty({ description: 'ID del evento asociado' })
  @IsNumber()
  @IsOptional()
  EventId: number;

  @ApiProperty({ description: 'ID del curso asociado' })
  @IsString()
  @IsOptional()
  courseId: number;

  @ApiProperty({ description: 'Cédula del usuario' })
  @IsString()
  @IsNotEmpty()
  userCedula: number;

  @ApiProperty({ description: 'ID de la sala' })
  @IsString()
  @IsNotEmpty()
  roomId: number;
}
