/* eslint-disable prettier/prettier */

import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsOptional } from "class-validator"
export class ActivitiesFilterDTO {
    @ApiPropertyOptional()
    @IsOptional()
    month?:string
    @ApiPropertyOptional()
    @IsOptional()
    programID?:string
}