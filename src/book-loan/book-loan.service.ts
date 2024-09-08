/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookLoan } from './book-loan.enity';
import { Repository } from 'typeorm';
import { CreateBookLoanDto } from './DTO/create-book-loan.dto';


@Injectable()
export class BookLoanService {
    constructor(
        @InjectRepository(BookLoan)
        private readonly bookLoanRepository: Repository<BookLoan>,
      ) {}
    
      async createLoan(createBookLoanDto: CreateBookLoanDto): Promise<BookLoan> {
        const newBookLoan = this.bookLoanRepository.create(createBookLoanDto);
        return await this.bookLoanRepository.save(newBookLoan);
      }

      async acceptBookLoan(
        bookLoanId: number,
      ): Promise<BookLoan> {
        const bookLoan = await this.bookLoanRepository.findOne({ where: { BookLoanId: bookLoanId } });
    
        if (!bookLoan) {
          throw new NotFoundException(`Book loan with ID ${bookLoanId} not found`);
        }
    
        bookLoan.Status = "En Proceso";
    
        return await this.bookLoanRepository.save(bookLoan);
      }

      async InProcessBookLoan(
        bookLoanId: number
      ): Promise<BookLoan> {
        const bookLoan = await this.bookLoanRepository.findOne({ where: { BookLoanId: bookLoanId } });
    
        if (!bookLoan) {
          throw new NotFoundException(`Book loan with ID ${bookLoanId} not found`);
        }
    
        bookLoan.Status = "Finalizado";
    
        return await this.bookLoanRepository.save(bookLoan);
      }

}
