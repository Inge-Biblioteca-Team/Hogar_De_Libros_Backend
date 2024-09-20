/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString} from "class-validator";

export class SendPasswordResetDto {
    @ApiProperty()
    @IsEmail({}, { message: 'El correo no es válido' })
    email: string;

    @ApiProperty()
    @IsString()
    cedula:string
  }