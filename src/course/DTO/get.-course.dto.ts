import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetCoursesDto {
  @ApiProperty({ description: 'Número de página'})
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  page: number = 1;

  @ApiProperty({ description: 'Número de elementos por página'})
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  limit: number = 10;
}
