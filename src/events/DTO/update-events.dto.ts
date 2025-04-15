/* eslint-disable prettier/prettier */
import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { CreateEventsDTO } from "./create-events.dto";
import { IsNumber} from "class-validator";

export class UpdateEventsDTO extends PartialType(CreateEventsDTO) {
    @ApiProperty()
    @IsNumber()
    EventId:number
    @ApiPropertyOptional()
    Status:string
}