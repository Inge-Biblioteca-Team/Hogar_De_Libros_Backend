import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsDateString, IsNotEmpty, IsString, IsDate } from 'class-validator';

export class CreateEnrollmentDto {
  
  @ApiProperty({ description: 'Cédula del usuario, opcional si no está registrado', nullable: true })
  @IsOptional()
  @IsString()
  userCedula?: string;

  
}
