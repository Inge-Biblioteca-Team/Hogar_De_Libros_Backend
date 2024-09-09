/* eslint-disable prettier/prettier */
import { Body, Controller, Get, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common';
import { BookLoanService } from './book-loan.service';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateBookLoanDto } from './DTO/create-book-loan.dto';
import { BookLoan } from './book-loan.enity';
import { FinalizeBookLoanDto } from './DTO/finalize-bookloan.dto';
import { updatedBookLoan } from './DTO/update-bookLoan.dto';
import { PaginationFilterBookLoanDto } from './DTO/pagination-filter-bookLoan.dto';

@ApiTags('booksLoan')
@Controller('book-loan')
export class BookLoanController {
    constructor(private bookLoanService: BookLoanService){}
    

    @Post()
    @ApiBody({ type: CreateBookLoanDto })
    @ApiResponse({
      status: 201,
      description: 'Creates a new book loan',
      type: BookLoan,
    })
    async createLoan(@Body() createBookLoanDto: CreateBookLoanDto): Promise<BookLoan> {
      return this.bookLoanService.createLoan(createBookLoanDto);
    }
    @Patch(':id/in-process')
    async setInProcess(@Param('id') bookLoanId: number): Promise<BookLoan> {
      const updatedBookLoan = await this.bookLoanService.setInProcess(bookLoanId);
      if (!updatedBookLoan) {
        throw new NotFoundException(`Préstamo de libro con ID ${bookLoanId} no encontrado`);
      }
      return updatedBookLoan;
    }
    
    @Patch(':id/finalize')
    async finalizeLoan(
      @Param('id') bookLoanId: number,
      @Body() finalizeBookLoanDto: FinalizeBookLoanDto
    ): Promise<BookLoan> {
      const updatedBookLoan = await this.bookLoanService.finalizeLoan(bookLoanId, finalizeBookLoanDto);
      if (!updatedBookLoan) {
        throw new NotFoundException(`Préstamo de libro con ID ${bookLoanId} no encontrado`);
      }
      return updatedBookLoan;
    }

    @Patch(':id/reject')
    async rejectBookLoan(@Param('id') bookLoanId: number): Promise<BookLoan> {
      const updatedBookLoan = await this.bookLoanService.rejectBookLoan(bookLoanId);
      if (!updatedBookLoan) {
        throw new NotFoundException(`Préstamo de libro con ID ${bookLoanId} no encontrado`);
      }
      return updatedBookLoan;
    }

  @Patch(':id')
  async update(
    @Param('id') bookLoanId: number,
    @Body() updatedBookLoanDto: updatedBookLoan
  ): Promise<BookLoan> {
    const updatedBookLoan = await this.bookLoanService.update(bookLoanId, updatedBookLoanDto);
    if (!updatedBookLoan) {
      throw new NotFoundException(`Préstamo de libro con ID ${bookLoanId} no encontrado`);
    }
    return updatedBookLoan;
  }
  
  @Get('/in-progress')
  async getInProgressLoans(): Promise<BookLoan[]> {
    return this.bookLoanService.getInProgressLoans();
  }

  @Get('/pending')
  async getPendingLoans(): Promise<BookLoan[]> {
    return this.bookLoanService.getPendingLoans();
  }
  
  @Get('/completed')
  async getCompletedLoans(): Promise<BookLoan[]> {
    return this.bookLoanService.getCompletedLoans();
  }
  @Get()
  async getBookLoans(@Query() filterDto: PaginationFilterBookLoanDto): Promise<{ data: BookLoan[]; count: number }> {
    return this.bookLoanService.getBookLoans(filterDto);
  }
  

}
