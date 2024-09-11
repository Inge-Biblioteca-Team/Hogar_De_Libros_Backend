/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookLoan } from './book-loan.enity';
import { Repository } from 'typeorm';
import { CreateBookLoanDto } from './DTO/create-book-loan.dto';
import { FinalizeBookLoanDto } from './DTO/finalize-bookloan.dto';
import { updatedBookLoan } from './DTO/update-bookLoan.dto';
import { PaginationFilterBookLoanDto } from './DTO/pagination-filter-bookLoan.dto';
import { query } from 'express';
import { PaginationBookLoanDto } from './DTO/pagination-bookLoans.dto';
import { User } from 'src/user/user.entity';
import { Book } from 'src/books/book.entity';

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
    const bookLoan = await this.bookLoanRepository.findOne({
      where: { BookLoanId: bookLoanId },
    });

    if (!bookLoan) {
      throw new NotFoundException(`Book loan with ID ${bookLoanId} not found`);
    }

    bookLoan.Status = 'En progreso';

    return await this.bookLoanRepository.save(bookLoan);
  }

  async finalizeLoan(
    bookLoanId: number,
    finalizeBookLoanDto: FinalizeBookLoanDto,
  ): Promise<BookLoan> {
    const bookLoan = await this.bookLoanRepository.findOne({
      where: { BookLoanId: bookLoanId },
    });

    if (!bookLoan) {
      throw new NotFoundException(`Book loan with ID ${bookLoanId} not found`);
    }
    bookLoan.Status = 'Finalizado';

    bookLoan.Observations = finalizeBookLoanDto.Observations;

    return await this.bookLoanRepository.save(bookLoan);
  }
 

  async update(
    bookLoanId: number,
    updateBookLoanDto: updatedBookLoan,
  ): Promise<BookLoan> {
    const bookLoan = await this.bookLoanRepository.findOne({
      where: { BookLoanId: bookLoanId },
    });

    if (!bookLoan) {
      throw new NotFoundException(
        `El préstamo con ID ${bookLoanId} no fue encontrado`,
      );
    }

    Object.assign(bookLoan, updateBookLoanDto);

    return this.bookLoanRepository.save(bookLoan);
  }

  async getInProgressLoans(
    paginationDto: PaginationBookLoanDto,
  ): Promise<{ data: BookLoan[]; count: number }> {
    const { page = 1, limit = 10 } = paginationDto;
    const query = this.bookLoanRepository
      .createQueryBuilder('bookLoan')
      .leftJoinAndSelect('bookLoan.book', 'book')
      .leftJoinAndSelect('bookLoan.user', 'user')
      .where('bookLoan.Status = :status', { status: 'En progreso' })
      .andWhere('bookLoan.book IS NOT NULL')  
  .andWhere('bookLoan.user IS NOT NULL'); 
    query.skip((page - 1) * limit).take(limit);

    const [data, count] = await query.getManyAndCount();
    return { data, count };
  }

  async getPendingLoans(
    paginationDto: PaginationBookLoanDto,
  ): Promise<{ data: BookLoan[]; count: number }> {
    const { page = 1, limit = 10 } = paginationDto;
    const query = this.bookLoanRepository
      .createQueryBuilder('bookLoan')
      .leftJoinAndSelect('bookLoan.book', 'book')
      .leftJoinAndSelect('bookLoan.user', 'user')
      .where('bookLoan.Status = :status', { status: 'Pendiente' });
      

    query.skip((page - 1) * limit).take(limit);

    const [data, count] = await query.getManyAndCount();
    return { data, count };
  }

  async getCompletedLoans(
    paginationDto: PaginationBookLoanDto,
  ): Promise<{ data: BookLoan[]; count: number }> {
    const { page = 1, limit = 10 } = paginationDto;
    const query = this.bookLoanRepository
      .createQueryBuilder('bookLoan')
      .leftJoinAndSelect('bookLoan.book', 'book')
      .leftJoinAndSelect('bookLoan.user', 'user')
      .where('bookLoan.Status = :status', { status: 'Finalizado' });

    query.skip((page - 1) * limit).take(limit);

    const [data, count] = await query.getManyAndCount();
    return { data, count };
  }

  async findBookLoans(
    filters: PaginationFilterBookLoanDto,
  ): Promise<{ data: BookLoan[]; count: number }> {
    const { page = 1, limit = 10 } = filters;
    const query = this.bookLoanRepository.createQueryBuilder('bookLoan');

    if (
      filters.LoanRequestDateRange &&
      filters.LoanRequestDateRange.length === 2
    ) {
      const [startDate, endDate] = filters.LoanRequestDateRange;
      query.andWhere(
        'bookLoan.LoanRequestDate BETWEEN :startDate AND :endDate',
        { startDate, endDate },
      );
    }

    if (filters.LoanExpirationDate) {
      query.andWhere('DATE(bookLoan.LoanExpirationDate) = :LoanExpirationDate', {
        LoanExpirationDate: filters.LoanExpirationDate,
      });
    }

    if (filters.BookPickUpDate) {
      query.andWhere('DATE(bookLoan.BookPickUpDate) = :BookPickUpDate', {
        BookPickUpDate: filters.BookPickUpDate,
      });
      console.log('Entre');
    }
    console.log(filters.BookPickUpDate);

    if (filters.bookBookCode) {
      query.andWhere('bookLoan.bookBookCode = :bookBookCode', {
        bookBookCode: filters.bookBookCode,
      });
    }

    if (filters.userId) {
      query
        .andWhere('bookLoan.Status = :status', { status: 'Finalizado' })
        .andWhere('bookLoan.userId = :userId', { userId: filters.userId });
    }

    const [data, count] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, count };
  }
}

function leftJoinAndSelect(arg0: string, arg1: string) {
  throw new Error('Function not implemented.');
}
