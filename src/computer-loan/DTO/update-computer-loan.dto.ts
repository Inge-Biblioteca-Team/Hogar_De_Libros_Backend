/* eslint-disable prettier/prettier */
import { PartialType } from "@nestjs/swagger";
import { CreateComputerLoanDto } from "./create-computer-loan.dto";

export class UpdateComputerLoanDto extends PartialType(CreateComputerLoanDto) {
}