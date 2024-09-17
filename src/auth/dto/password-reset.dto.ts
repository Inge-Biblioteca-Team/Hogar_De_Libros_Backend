import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class SendPasswordResetDto {
    @ApiProperty()
    @IsEmail({}, { message: 'El correo no es válido' })
    email: string;
  }