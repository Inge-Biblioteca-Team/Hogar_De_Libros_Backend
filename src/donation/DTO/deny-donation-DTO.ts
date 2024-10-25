/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class DenyDonationRequestDTO {
    @ApiProperty({ description: 'Motivo de la denegación', example: 'No cumple con los requisitos' })
    @IsString()
    @IsNotEmpty()
    reason: string;
}