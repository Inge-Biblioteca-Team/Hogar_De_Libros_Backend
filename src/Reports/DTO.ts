/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
export class ReportDto {
  @ApiProperty()
  @IsOptional()
  startDate: string;
  @ApiProperty()
  @IsOptional()
  endDate: string;
}
