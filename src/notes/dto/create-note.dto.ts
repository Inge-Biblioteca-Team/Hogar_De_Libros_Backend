/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
export class CreateNoteDto {
  @ApiProperty({ description: 'Mensaje', default: 'Test' })
  message: string;

  @ApiProperty({ description: 'categoria', default: 'test' })
  type: string;
}
