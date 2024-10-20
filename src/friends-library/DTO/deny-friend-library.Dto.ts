import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class DenyFriendRequestDTO {
  @ApiProperty({ description: 'Motivo de la denegación', example: 'No cumple con los requisitos' })
  @IsString()
  @IsNotEmpty()
  reason: string;
}
