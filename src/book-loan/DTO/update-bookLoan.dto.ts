import { PartialType } from "@nestjs/swagger";
import { CreateBookLoanDto } from "./create-book-loan.dto";

export class updatedBookLoan extends PartialType(CreateBookLoanDto){}