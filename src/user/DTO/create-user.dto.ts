/* eslint-disable prettier/prettier */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Role } from '../user.entity';

export class CreateUserDto {

  @ApiProperty({ description: 'Cédula del usuario' })
  @IsString()
  @IsNotEmpty({ message: 'La cédula es obligatoria' })
  cedula: string;

  @ApiProperty({ description: 'Correo electrónico del usuario' })
  @IsEmail()
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  email: string;

  @ApiProperty({ description: 'Nombre del usuario' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre del usuario es obligatorio' })
  name: string;

  @ApiProperty({ description: 'Apellido del usuario' })
  @IsString()
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  lastName: string;

  @ApiProperty({ description: 'Número de teléfono del usuario' })
  @IsString()
  @IsNotEmpty({ message: 'El número de teléfono es obligatorio' })
  phoneNumber: string;

  @ApiProperty({ description: 'Provincia donde vive el usuario' })
  @IsString()
  @IsNotEmpty({ message: 'La Provincia es obligatoria' })
  province: string;

  @ApiProperty({ description: 'Distrito donde vive el usuario' })
  @IsString()
  @IsNotEmpty({ message: 'El Distrito es obligatorio' })
  district: string;

  @ApiProperty({ description: 'Género del usuario' })
  @IsString()
  @IsNotEmpty({ message: 'El género es obligatorio' })
  gender: string;

  @ApiProperty({ description: 'Dirección de residencia del usuario' })
  @IsString()
  @IsNotEmpty({ message: 'La dirección es obligatoria' })
  address: string;

  @ApiProperty({ description: 'Fecha de nacimiento del usuario' })
  @IsDate()
  @IsNotEmpty({ message: 'La fecha de nacimiento es obligatoria' })
  birthDate: Date;

  @ApiProperty({ description: 'Contraseña del usuario' })
  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty({ message: 'Debe aceptar los términos y condiciones' })
  acceptTermsAndConditions: boolean;

  @ApiProperty({ description: 'Rol del usuario', enum: Role })
  @IsEnum(Role)
  role: Role = Role.ExternalUser;

  @ApiPropertyOptional()
  @IsNumber()
  loanPolicy:number
}
