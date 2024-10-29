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
  @IsNotEmpty({ message: 'Nombre de la institución es obligatorio' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Fecha de emisión' })
  @IsNotEmpty({ message: 'El campo Fecha de emisión es obligatorio' })
  @IsDate()
  date: Date;

  @ApiProperty({ description: 'Array con las horas de reserva (de 8 a 17)' })
  @ArrayMinSize(1, { message: 'Debe seleccionar al menos una hora' })
  @ArrayMaxSize(10, { message: 'Puede seleccionar hasta un máximo de 10 horas' })
  @IsNotEmpty({ message: 'El campo Seleccion de Horas es obligatorio' })
  @IsArray({ message: 'Seleccion de Horas  debe ser un array de números' })
  selectedHours: number[];

  @ApiProperty({ description: 'Observaciones adicionales' })
  @IsString({ message: 'El campo Observaciones adicionales debe ser una cadena de texto' })
  @IsOptional()
  observations?: string;

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
  @IsNotEmpty({ message: 'El campo Cédula del usuario es obligatorio' })
  userCedula: string;

  @ApiProperty({ description: 'ID de la sala' })
  @IsNotEmpty({ message: 'El campo ID de la sala es obligatorio' })
  @IsNumber({}, { message: 'roomId debe ser un número' })
  roomId: number;

  @ApiProperty({ description: 'Fecha de la reserva' })
  @IsOptional()
  @IsDate({ message: 'Fecha de la reserva debe ser una fecha válida' })
  reservationDate?: Date;
}
