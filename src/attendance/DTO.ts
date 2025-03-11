/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class NewAttendanceDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
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
