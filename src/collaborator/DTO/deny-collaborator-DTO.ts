/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class DenyCollaboratorRequestDTO {
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
