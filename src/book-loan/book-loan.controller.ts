/* eslint-disable prettier/prettier */
import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { BookLoanService } from './book-loan.service';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateBookLoanDto } from './DTO/create-book-loan.dto';
import { BookLoan } from './book-loan.enity';
import { UpdateBookLoanStatusDto } from './DTO/update-book-loan.dto';

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
    
    @Patch(':bookLoanId/accept')
  @ApiOperation({ summary: 'Aceptar una solicitud de préstamo de libro' })
  @ApiParam({ name: 'bookLoanId', description: 'ID del préstamo de libro' })
  @ApiBody({ type: UpdateBookLoanStatusDto })
  @ApiResponse({
    status: 200,
    description: 'Solicitud de préstamo aceptada',
    type: BookLoan,
  })
  @ApiResponse({ status: 404, description: 'Préstamo de libro no encontrado' })
  async acceptBookLoan(
    @Param('bookLoanId') bookLoanId: number,
    @Body() updateBookLoanStatusDto: UpdateBookLoanStatusDto,
  ): Promise<BookLoan> {
    return this.bookLoanService.acceptBookLoan(bookLoanId, updateBookLoanStatusDto);
  }
  
}
