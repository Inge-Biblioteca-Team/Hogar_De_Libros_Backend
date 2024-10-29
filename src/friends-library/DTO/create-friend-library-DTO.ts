import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  IsDate,
} from 'class-validator';

export class CreateFriendDTO {
  
  @ApiProperty({ description: 'Nombre del amigo', example: 'Juan Perez Gomez' })
  @IsString()
  @IsNotEmpty({ message: 'Nombre  es obligatorio' })
  UserFullName: string;

  @ApiProperty({ description: 'Cédula del amigo', example: '123456789' })
  @IsString()
  @IsNotEmpty({ message: 'Cedula es obligatorio' })
  UserCedula: string;


  @ApiProperty({ description: 'Edad del amigo', example: '2024-10-15' })
  @IsNotEmpty()
  @IsDateString()
  UserBirthDate: string;

  @ApiProperty({ description: 'Genero del amigo', example: 'Hombre' })
  @IsString()
  @IsNotEmpty()
  UserGender: string;



  @ApiProperty({ description: 'Dirección del amigo', example: 'Calle 123' })
  @IsString()
  @IsNotEmpty({ message: 'Direccion es obligatorio' })
  UserAddress: string;

  @ApiProperty({ description: 'Teléfono del amigo', example: '123456789' })
  @IsString()
  @IsNotEmpty({ message: 'Telefono es obligatorio' })
  UserPhone: string;

  @ApiProperty({
    description: 'Correo del amigo',
    example: 'juanPerez@gmail.com',
  })
  @IsEmail({}, { message: 'Email debe ser un correo válido' })
  @IsNotEmpty({ message: 'Email es obligatorio' })
  UserEmail: string;

  @ApiProperty({ description: 'Categoría principal', example: 'Voluntariado' })
  @IsString( )
  @IsOptional()
  PrincipalCategory?: string;

  @ApiProperty({ description: 'Subcategoría', example: 'Donación' })
  @IsString()

  @IsNotEmpty()
  SubCategory: string;

  @ApiProperty({
    description: 'Experencia de ser necesaria',
    example: 'Experiencia en informatica',
  })
  @IsString()
  @IsOptional()
  Experience?: string;

  @ApiProperty({
    description: 'Documentos',
    example: ['documento1', 'documento2'],
  })
  @IsOptional()
  @IsArray({ message: 'Documentos' })
  @IsString()
  Document?: string[];

  @ApiProperty({
    description: 'Fecha de recolección del donativo',
    example: '2024-10-15',
  })
  @IsOptional()
  @IsDate({ message: 'Fecha de recoleccion del donativo debe ser una fecha válida' })
  DateRecolatedDonation?: Date;

  @ApiProperty({
    description: 'Infromacion Adicional',
    example: 'Conocimiento previo',
  })
  @IsString({ message: 'Infromacion Adicional debe ser una cadena de texto' })
  @IsOptional()
  ExtraInfo?: string;

}
