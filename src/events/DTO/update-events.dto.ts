import { PartialType } from "@nestjs/swagger";
import { CreateEventsDTO } from "./create-events.dto";

export class UpdateEventsDTO extends PartialType(CreateEventsDTO) {}