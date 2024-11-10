/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty} from 'class-validator';

export class CreateProgramDto {
  
  @ApiProperty({ description: 'Nombre del programa' })
  @IsString()
  @IsNotEmpty({ message: 'Nombre del programaes obligatorio' })
  programName: string;

  @ApiProperty({ description: 'Descripción del programa' })
  @IsString()
  @IsNotEmpty({ message: ' Descripción es obligatorio' })
  description: string;

  @ApiProperty({ description: 'URL de la imagen del programa', example: 'http://example.com/image.jpg' })
  @IsOptional()
  @IsString()
  image?: string;
}
