import { Controller, Get } from '@nestjs/common';
import { BookLoanService } from './book-loan.service';

@Controller('book-loan')
export class BookLoanController {
    constructor(private bookLoanService: BookLoanService){}
    
  
}
