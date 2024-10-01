/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateEnrollmentDto {
  @ApiProperty({
    description: 'Cédula del usuario, opcional si no está registrado',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  userCedula?: string;

  @ApiProperty({
    description: 'Dirección del usuario',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  direction?: string; // Cambiado de direcction a direction (corrección ortográfica)

  @ApiProperty({
    description: 'Teléfono del usuario',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'Teléfono de emergencia del usuario',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  ePhone?: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  UserName?: string;
}