/* eslint-disable prettier/prettier */
import { PartialType } from "@nestjs/swagger";
import { CreateEventsDTO } from "./create-events.dto";

export class UpdateEventsDTO extends PartialType(CreateEventsDTO) {
    EventId:number
    Status:string
}