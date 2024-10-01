import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class getRoomDto {
    
    @ApiProperty({ description: 'Page number for pagination', example: 1, required: false })
    @IsOptional()
    @IsNumber()
    @Min(1)
    page?: number = 1;
  
    @ApiProperty({ description: 'Number of items per page', example: 10, required: false })
    @IsOptional()
    @IsNumber()
    @Min(1)
    limit?: number = 10;
    
    @ApiProperty({ description: 'Room status (D,M o C)',required: false})
    @IsOptional()
    @IsString()
    status?: string;

    @ApiProperty({ description: 'Room number',required: false})
    @IsOptional()
    @IsString()
    roomNumber?: string;

    @ApiProperty({ description: 'Room name', required: false})
    @IsOptional()
    @IsString()
    name?: string;
}
