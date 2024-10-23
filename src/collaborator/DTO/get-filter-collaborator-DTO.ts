import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEnum, IsOptional, IsString } from "class-validator";

export class GetAllCollaboratorFilterDTO {
    @ApiProperty({ description: 'Filtrar por subcategoría', example: 'Donación', required: false })
    @IsString()
    @IsOptional()
    SubCategory?: string;
  
    @ApiProperty({ description: 'Filtrar por categoría principal', example: 'Voluntariado', required: false })
    @IsString()
    @IsOptional()
    PrincipalCategory?: string;
  
    @ApiProperty({ description: 'Filtrar por fecha de solicitud', example: '2024-12-25', required: false })
    @IsDate()
    @IsOptional()
    DateGenerated?: Date;
    
    @ApiProperty({ description: 'Filtrar por estado', example: 'P', required: false })
    @IsEnum(['P', 'R', 'A' ,'PE',], { message: 'El estado debe ser "P", "R", "A" o "PE"' })
    @IsOptional()
    Status?: string;
  
    @ApiProperty({ description: 'Número de página', example: 1, required: false })
    @IsOptional()
    page?: number;
  
    @ApiProperty({ description: 'Número de elementos por página', example: 10, required: false })
    @IsOptional()
    limit?: number;
}