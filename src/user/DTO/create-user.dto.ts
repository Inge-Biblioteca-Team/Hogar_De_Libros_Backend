/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  cedula:string;
  @ApiProperty({ description: 'Correo electrónico del usuario' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Nombre del usuario' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Apellido del usuario' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ description: 'Número de teléfono del usuario' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ description: 'Provincia donde vive el usuario' })
  @IsString()
  @IsNotEmpty()
  province: string;

  @ApiProperty({ description: 'Distrito donde vive el usuario' })
  @IsString()
  @IsNotEmpty()
  district: string;

  @ApiProperty({ description: 'Género del usuario' })
  @IsString()
  @IsNotEmpty()
  gender: string;

  @ApiProperty({ description: 'Dirreción de residencia del usuario' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ description: 'Fecha de nacimiento del usuario' })
  @IsDate()
  @IsNotEmpty()
  birthDate: Date;

  @ApiProperty({ description: 'Contraseña del usuario' })
  @IsString()
  @IsNotEmpty()
  password: string;
  @ApiProperty()
  registerDate: Date;
  @ApiProperty({ description: 'Número de teléfono del usuario' })
  @IsBoolean()
  @IsNotEmpty()
  acceptTermsAndConditions: boolean;

  
}
