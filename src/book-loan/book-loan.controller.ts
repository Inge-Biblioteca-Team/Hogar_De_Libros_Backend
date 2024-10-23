/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { BookLoanService } from './book-loan.service';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateBookLoanDto } from './DTO/create-book-loan.dto';
import { BookLoan } from './book-loan.entity';
import { FinalizeBookLoanDto } from './DTO/finalize-bookloan.dto';
import { updatedBookLoan } from './DTO/update-bookLoan.dto';
import { GETResponseDTO } from './DTO/GETSResponse';
import { BookLoanResponseDTO } from './DTO/RequestDTO';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('booksLoan')
@Controller('book-loan')
export class BookLoanController {
  constructor(private bookLoanService: BookLoanService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'external_user')
  @Post()
  @ApiBody({ type: CreateBookLoanDto })
  @ApiResponse({
    status: 201,
    description: 'Creates a new book loan',
    type: BookLoan,
  })
  async createLoan(
    @Body() createBookLoanDto: CreateBookLoanDto,
    @Req() request: Request,
  ): Promise<BookLoan> {
    const user = request['user'];

    if (!user) {
      throw new UnauthorizedException(
        'No se pudo obtener la información del usuario.',
      );
    }
    return this.bookLoanService.createLoan(createBookLoanDto, user);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/in-process')
  async setInProcess(@Param('id') bookLoanId: number): Promise<BookLoan> {
    const updatedBookLoan = await this.bookLoanService.setInProcess(bookLoanId);
    if (!updatedBookLoan) {
      throw new NotFoundException(
        `Préstamo de libro con ID ${bookLoanId} no encontrado`,
      );
    }
    return updatedBookLoan;
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/finalize')
  async finalizeLoan(
    @Param('id') bookLoanId: number,
    @Body() finalizeBookLoanDto: FinalizeBookLoanDto,
  ): Promise<BookLoan> {
    const updatedBookLoan = await this.bookLoanService.finalizeLoan(
      bookLoanId,
      finalizeBookLoanDto,
    );
    if (!updatedBookLoan) {
      throw new NotFoundException(
        `Préstamo de libro con ID ${bookLoanId} no encontrado`,
      );
    }
    return updatedBookLoan;
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  async update(
    @Param('id') bookLoanId: number,
    @Body() updatedBookLoanDto: updatedBookLoan,
  ): Promise<BookLoan> {
    const updatedBookLoan = await this.bookLoanService.update(
      bookLoanId,
      updatedBookLoanDto,
    );
    if (!updatedBookLoan) {
      throw new NotFoundException(
        `Préstamo de libro con ID ${bookLoanId} no encontrado`,
      );
    }
    return updatedBookLoan;
  }
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'external_user')
  @Get('in-progress')
  async getInProgressLoans(
    @Query() paginationDto: GETResponseDTO,
  ): Promise<{ data: BookLoanResponseDTO[]; count: number }> {
    return this.bookLoanService.getInProgressLoans(paginationDto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'external_user')
  @Get('pending')
  async getPendingLoans(
    @Query() paginationDto: GETResponseDTO,
  ): Promise<{ data: BookLoanResponseDTO[]; count: number }> {
    return this.bookLoanService.getPendingLoans(paginationDto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'external_user')
  @Get('completed')
  async getCompletedLoans(
    @Query() paginationDto: GETResponseDTO,
  ): Promise<{ data: BookLoanResponseDTO[]; count: number }> {
    return this.bookLoanService.getCompletedLoans(paginationDto);
  }
}
