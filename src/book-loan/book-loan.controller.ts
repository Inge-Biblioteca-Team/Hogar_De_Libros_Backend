/* eslint-disable prettier/prettier */
import { Body, Controller, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { BookLoanService } from './book-loan.service';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateBookLoanDto } from './DTO/create-book-loan.dto';
import { BookLoan } from './book-loan.enity';
import { FinalizeBookLoanDto } from './DTO/finalize-bookloan.dto';
import { updatedBookLoan } from './DTO/update-bookLoan.dto';


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
    async finalizeLoan(@Param('id') bookLoanId: number, @Body() finalizeBookLoanDto: FinalizeBookLoanDto): Promise<BookLoan> {
      const updatedBookLoan = await this.bookLoanService.finalizeLoan(bookLoanId, finalizeBookLoanDto);
      if (!updatedBookLoan) {
        throw new NotFoundException(`Préstamo de libro con ID ${bookLoanId} no encontrado`);
      }
      return updatedBookLoan;
    }
    //Aceptar solicitud  usuario externo
    @Patch(':id/accept')
    async acceptBookLoan(@Param('id') bookLoanId: number): Promise<BookLoan> {
      const updatedBookLoan = await this.bookLoanService.acceptBookLoan(bookLoanId);
      if (!updatedBookLoan) {
        throw new NotFoundException(`Préstamo de libro con ID ${bookLoanId} no encontrado`);
      }
      return updatedBookLoan;
    }

    @Patch(':bookLoanId')
    @ApiOperation({})
    async updatePartial(
      @Param('bookLoanId') bookLoanId: number,
      @Body() updatedBookLoandDto: updatedBookLoan,
    ) {
      return await this.bookLoanService.update(bookLoanId, updatedBookLoandDto);
    }
  

}
