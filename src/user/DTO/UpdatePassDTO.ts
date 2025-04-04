import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

/* eslint-disable prettier/prettier */
export class UpdatePasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly cedula: string;
  
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly newPassword: string;
}
