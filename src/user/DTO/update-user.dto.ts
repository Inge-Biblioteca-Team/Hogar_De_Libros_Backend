/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  cedula:string;
  @ApiProperty({ description: 'Correo electrónico del usuario' })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({ description: 'Nombre del usuario' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ description: 'Apellido del usuario' })
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty({ description: 'Número de teléfono del usuario' })
  @IsString()
  @IsOptional()
  phoneNumber: string;

  @ApiProperty({ description: 'Provincia donde vive el usuario' })
  @IsString()
  @IsOptional()
  province: string;

  @ApiProperty({ description: 'Distrito donde vive el usuario' })
  @IsString()
  @IsOptional()
  district: string;

  @ApiProperty({ description: 'Género del usuario' })
  @IsString()
  @IsOptional()
  gender: string;

  @ApiProperty({ description: 'Dirreción de residencia del usuario' })
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty({ description: 'Fecha de nacimiento del usuario' })
  @IsDate()
  @IsOptional()
  birthDate: Date; 
}
