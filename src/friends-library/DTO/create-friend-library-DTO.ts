import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateFriendDTO {
  @ApiProperty({ description: 'Nombre del amigo', example: 'Juan Perez Gomez' })
  @IsString()
  @IsNotEmpty()
  UserFullName: string;

  @ApiProperty({ description: 'Cédula del amigo', example: '123456789' })
  @IsString()
  @IsNotEmpty()
  UserCedula: string;

  @ApiProperty({ description: 'Discapacidad', example: 'Cojo' })
  @IsString()
  @IsNotEmpty()
  Disability: string;

  @ApiProperty({ description: 'Edad del amigo', example: '2024-10-15' })
  @IsNotEmpty()
  @IsDate()
  UserBirthDate: Date;

  @ApiProperty({ description: 'Dirección del amigo', example: 'Calle 123' })
  @IsString()
  @IsNotEmpty()
  UserAddress: string;

  @ApiProperty({ description: 'Teléfono del amigo', example: '123456789' })
  @IsString()
  @IsNotEmpty()
  UserPhone: string;

  @ApiProperty({
    description: 'Correo del amigo',
    example: 'juanPerez@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  UserEmail: string;

  @ApiProperty({ description: 'Categoría principal', example: 'Voluntariado' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  PrincipalCategory: string;

  @ApiProperty({ description: 'Subcategoría', example: 'Donación' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  SubCategory: string;

  @ApiProperty({
    description: 'Documentos',
    example: ['documento1', 'documento2'],
  })
  @IsOptional()
  Document?: string[];

  @ApiProperty({
    description: 'Fecha de recoleccion del donativo',
    example: '2024-10-15',
  })
  @IsOptional()
  @IsDate()
  DateRecolatedDonation?: Date;

  @ApiProperty({
    description: 'Información extra',
    example: 'Conocimiento previo',
  })
  @IsString()
  @IsOptional()
  ExtraInfo?: string;
}
