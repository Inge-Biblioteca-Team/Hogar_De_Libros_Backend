/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookLoan } from './book-loan.enity';
import { Repository } from 'typeorm';
import { CreateBookLoanDto } from './DTO/create-book-loan.dto';
import { FinalizeBookLoanDto } from './DTO/finalize-bookloan.dto';
import { updatedBookLoan } from './DTO/update-bookLoan.dto';


@Injectable()
export class BookLoanService {
    constructor(
        @InjectRepository(BookLoan)
        private readonly bookLoanRepository: Repository<BookLoan>,
      ) {}
    
      async createLoan(createBookLoanDto: CreateBookLoanDto): Promise<BookLoan> {
        const newBookLoan = this.bookLoanRepository.create(createBookLoanDto);
        newBookLoan.Status = 'Pendiente';
        return await this.bookLoanRepository.save(newBookLoan);
    
      }
      async setInProcess(bookLoanId: number): Promise<BookLoan> {
        const bookLoan = await this.bookLoanRepository.findOne({ where: { BookLoanId: bookLoanId } });
    
        if (!bookLoan) {
            throw new NotFoundException(`Book loan with ID ${bookLoanId} not found`);
        }
    
        bookLoan.Status = 'En progreso';
    
        return await this.bookLoanRepository.save(bookLoan);
    }

    async finalizeLoan( bookLoanId: number, finalizeBookLoanDto: FinalizeBookLoanDto ): Promise<BookLoan> {
      
      const bookLoan = await this.bookLoanRepository.findOne({ where: { BookLoanId: bookLoanId } });
  
      if (!bookLoan) {
          throw new NotFoundException(`Book loan with ID ${bookLoanId} not found`);
      }
      bookLoan.Status = 'Finalizado';
      
      bookLoan.Observations = finalizeBookLoanDto.Observations;
  
      return await this.bookLoanRepository.save(bookLoan);
  }
  async rejectBookLoan(bookLoanId: number): Promise<BookLoan> {
    const bookLoan = await this.bookLoanRepository.findOne({ where: { BookLoanId: bookLoanId } });
  
    if (!bookLoan) {
      throw new NotFoundException(`Préstamo de libro con ID ${bookLoanId} no encontrado`);
    }
  
    // Cambiar el estado a "Reprobado"
    bookLoan.Status = 'Reprobado';
  
    return await this.bookLoanRepository.save(bookLoan);
  }
   
  async update(bookLoanId: number, updateBookLoanDto: updatedBookLoan): Promise<BookLoan> {
    const bookLoan = await this.bookLoanRepository.findOne({
      where: { BookLoanId: bookLoanId }, 
    });
  
    if (!bookLoan) {
      throw new NotFoundException(`El préstamo con ID ${bookLoanId} no fue encontrado`);
    }

    Object.assign(bookLoan, updateBookLoanDto);
  
    return this.bookLoanRepository.save(bookLoan); 
  }
  
 
      }