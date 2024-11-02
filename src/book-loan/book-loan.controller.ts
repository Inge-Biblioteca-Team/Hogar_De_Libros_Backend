/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BookLoanService } from './book-loan.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateBookLoanDto } from './DTO/create-book-loan.dto';
import { updatedBookLoan } from './DTO/update-bookLoan.dto';
import { GETResponseDTO } from './DTO/GETSResponse';
import { BookLoanResponseDTO } from './DTO/RequestDTO';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { ChangeLoanStatus } from './DTO/ChangeLoanStatus.dto';

@ApiTags('booksLoan')
@Controller('book-loan')
export class BookLoanController {
  constructor(private bookLoanService: BookLoanService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'asistente')
  @ApiBody({ type: CreateBookLoanDto })
  async createLoan(
    @Body() createBookLoanDto: CreateBookLoanDto,
  ): Promise<{ message: string }> {
    return this.bookLoanService.createLoan(createBookLoanDto);
  }
  @Post("/AdminLoan")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'asistente')
  @ApiBody({ type: CreateBookLoanDto })
  async createAdminLoan(
    @Body() createBookLoanDto: CreateBookLoanDto,
  ): Promise<{ message: string }> {
    return this.bookLoanService.createAdminLoan(createBookLoanDto);
  }

  // Corregir la logica no va en el controlador
  @Patch('/in-process')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async setInProcess(
    @Body() data: ChangeLoanStatus,
  ): Promise<{ message: string }> {
    return await this.bookLoanService.setInProcess(data);
  }

  // Corregir la logica no va en el controlador
  @Patch('/finalize')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async finalizeLoan(
    @Body() data: ChangeLoanStatus,
  ): Promise<{ message: string }> {
    return await this.bookLoanService.finalizeLoan(data);
  }

  // Corregir la logica no va en el controlador
  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async update(
    @Param('id') bookLoanId: number,
    @Body() updatedBookLoanDto: updatedBookLoan,
  ): Promise<{ message: string }> {
    return await this.bookLoanService.update(bookLoanId, updatedBookLoanDto);
  }

  @Get('in-progress')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'asistente', 'external_user')
  async getInProgressLoans(
    @Query() paginationDto: GETResponseDTO,
  ): Promise<{ data: BookLoanResponseDTO[]; count: number }> {
    return this.bookLoanService.getInProgressLoans(paginationDto);
  }

  @Get('pending')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'asistente', 'external_user')
  async getPendingLoans(
    @Query() paginationDto: GETResponseDTO,
  ): Promise<{ data: BookLoanResponseDTO[]; count: number }> {
    return this.bookLoanService.getPendingLoans(paginationDto);
  }

  @Get('completed')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'asistente', 'external_user')
  async getCompletedLoans(
    @Query() paginationDto: GETResponseDTO,
  ): Promise<{ data: BookLoanResponseDTO[]; count: number }> {
    return this.bookLoanService.getCompletedLoans(paginationDto);
  }

  // Este endpoint espera el estado del prestado
  @Get('Loan-List')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'asistente', 'external_user')
  async getLoansList(
    @Query() paginationDto: GETResponseDTO,
  ): Promise<{ data: BookLoanResponseDTO[]; count: number }> {
    return this.bookLoanService.getLoansList(paginationDto);
  }


}
