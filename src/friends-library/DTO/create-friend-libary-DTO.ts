import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateFriendDTO {
  @ApiProperty({ description: 'Nombre del amigo', example: 'Juan' })
  @IsString()
  @IsNotEmpty()
  UserName: string;

  @ApiProperty({ description: 'Apellido del amigo', example: 'Perez' })
  @IsString()
  @IsNotEmpty()
  UserLastName: string;

  @ApiProperty({ description: 'Cédula del amigo', example: '123456789' })
  @IsString()
  @IsNotEmpty()
  UserCedula: string;

  @ApiProperty({ description: 'Género del amigo', example: 'Masculino' })
  @IsString()
  @IsNotEmpty()
  UserGender: string;

  @ApiProperty({ description: 'Edad del amigo', example: 25 })
  @IsNotEmpty()
  @IsNumber()
  UserAge: number;

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

  @ApiProperty({ description: 'Imágenes', example: ['imagen1', 'imagen2'] })
  @IsOptional()
  Image: string[];

  @ApiProperty({
    description: 'Fecha de recoleccion del donativo',
    example: '2024-10-15',
  })
  @IsOptional()
  @IsDate()
  DateRecolatedDonation?: Date;
}
