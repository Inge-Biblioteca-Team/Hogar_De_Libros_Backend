import { PartialType } from "@nestjs/swagger";
import { ComputerDTO } from "./create-computer.dto";

export class ModifyComputerDTO extends PartialType(ComputerDTO) {}