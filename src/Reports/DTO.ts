/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
export class ReportDto {
  @ApiProperty()
  startDate: string;
  @ApiProperty()
  endDate: string;
}
