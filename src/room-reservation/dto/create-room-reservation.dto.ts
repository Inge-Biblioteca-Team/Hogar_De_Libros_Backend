/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRoomReservationDto {
  @ApiProperty({ description: 'Nombre de la institución' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Fecha de emisión' })
  @IsNotEmpty()
  @IsDate()
  date: Date;

  @ApiProperty({ description: 'Array con las horas de reserva 8-17' })
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @IsNotEmpty()
  @IsArray()
  selectedHours: number[];

  @ApiProperty({ description: 'Observaciones adicionales' })
  @IsString()
  @IsOptional()
  observations: string;

  @ApiProperty({ description: 'ID del evento asociado' })
  @IsOptional()
  @IsNumber()
  EventId?: number;

  @ApiProperty({ description: 'ID del curso asociado' })
  @IsOptional()
  @IsNumber()
  courseId?: number;

  @ApiProperty({ description: 'Cédula del usuario' })
  @IsString()
  @IsNotEmpty()
  userCedula: string;

  @ApiProperty({ description: 'ID de la sala' })
  @IsNotEmpty()
  @IsNumber()
  roomId: number;

  @IsOptional()
  @IsDate()
  reservationDate: Date;
}
