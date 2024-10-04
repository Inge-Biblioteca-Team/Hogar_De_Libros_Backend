/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ReturnRoomDTO {
  @ApiProperty({ description: 'Nombre de la institución' })
  @IsNumber()
  @IsNotEmpty()
  rommReservationId: number;

  @ApiProperty({ description: 'Observaciones de finalizacion' })
  @IsNumber()
  @IsNotEmpty()
  finishObservation: number;
}
