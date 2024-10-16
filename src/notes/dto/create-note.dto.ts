/* eslint-disable prettier/prettier */

import { IsOptional } from 'class-validator';
export class CreateNoteDto {
  @IsOptional()
  date: Date = new Date();

  message: string;
  type: string;
}
