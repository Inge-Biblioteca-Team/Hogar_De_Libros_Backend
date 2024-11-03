/* eslint-disable prettier/prettier */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWorkStationDto {

  @ApiProperty()
  MachineNumber: number;

  @ApiPropertyOptional()
  Location: string;

  @ApiProperty()
  Status: string;
}
