/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { BookLoanService } from './book-loan.service';

@Controller('book-loan')
export class BookLoanController {
    constructor(private bookLoanService: BookLoanService){}
    
  
}
