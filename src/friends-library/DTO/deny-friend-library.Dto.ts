/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class DenyFriendRequestDTO {
  @ApiProperty({
    description: 'Motivo de rechazo',
    example: 'Porque si',
    default: 'Rechazado por el administrador',
  })
  @IsString()
  reason: string;

  @ApiProperty()
  @IsNotEmpty()
  Id: number
}
