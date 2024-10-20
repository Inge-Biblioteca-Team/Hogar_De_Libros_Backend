import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';

export class GetAllFriendsFilterDTO {
  @ApiProperty({ description: 'Filtrar por subcategoría', example: 'Donación', required: false })
  @IsString()
  @IsOptional()
  SubCategory?: string;

  @ApiProperty({ description: 'Filtrar por categoría principal', example: 'Voluntariado', required: false })
  @IsString()
  @IsOptional()
  PrincipalCategory?: string;

  @ApiProperty({ description: 'Filtrar por discapacidad', example: 'Cojo', required: false })
  @IsString()
  @IsOptional()
  Disability?: string;
  
  @ApiProperty({ description: 'Filtrar por estado', example: 'P', required: false })
  @IsEnum(['P', 'R', 'A'], { message: 'El estado debe ser "P", "R" o "A"' })
  @IsOptional()
  Status?: string;

  @ApiProperty({ description: 'Número de página', example: 1, required: false })
  @IsOptional()
  page?: number;

  @ApiProperty({ description: 'Número de elementos por página', example: 10, required: false })
  @IsOptional()
  limit?: number;
}
