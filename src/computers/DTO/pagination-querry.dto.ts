import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDTO {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({ example: 10 })
  Limit: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 0 })
  Offset: number;
}
