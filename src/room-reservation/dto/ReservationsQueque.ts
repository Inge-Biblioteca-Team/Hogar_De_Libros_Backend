/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';

export class Queque {
  @ApiProperty({ description: 'Nombre de la institución' })
  rommReservationId: number;
  @ApiProperty({ description: 'Horas ocupada' })
  selectedHours: number[];
  @ApiProperty({ description: 'Numero de sala' })
  roomNumber: string;
}
