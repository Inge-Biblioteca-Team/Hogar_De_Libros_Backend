/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class NewAttendanceDTO {
  @ApiProperty()
  @IsNotEmpty()
  cedula: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  age: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  gender: string;
}
