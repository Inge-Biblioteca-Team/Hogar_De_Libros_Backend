import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Correo electrónico del usuario' })
  @IsEmail()
  @IsNotEmpty()
  Email: string;

  @ApiProperty({ description: 'Nombre del usuario' })
  @IsString()
  @IsNotEmpty()
  Name: string;

  @ApiProperty({ description: 'Apellido del usuario' })
  @IsString()
  @IsNotEmpty()
  LastName: string;

  @ApiProperty({ description: 'Número de teléfono del usuario' })
  @IsNumber()
  @IsNotEmpty()
  PhoneNumber: number;

  @ApiProperty({ description: 'Provincia donde vive el usuario' })
  @IsString()
  @IsNotEmpty()
  Province: string;

  @ApiProperty({ description: 'Distrito donde vive el usuario' })
  @IsString()
  @IsNotEmpty()
  District: string;

  @ApiProperty({ description: 'Género del usuario' })
  @IsString()
  @IsNotEmpty()
  Gender: string;

  @ApiProperty({ description: 'Dirreción de residencia del usuario' })
  @IsString()
  @IsNotEmpty()
  Address: string;

  @ApiProperty({ description: 'Fecha de nacimiento del usuario' })
  @IsDate()
  @IsNotEmpty()
  BirthDate: Date;

  @ApiProperty({ description: 'Contraseña del usuario' })
  @IsString()
  @IsNotEmpty()
  Password: string;

  @ApiProperty({ description: 'Número de teléfono del usuario' })
  @IsBoolean()
  @IsNotEmpty()
  AccpetTermsAndConditions: boolean;
}
