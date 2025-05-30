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
import { BookLoanResponseDTO, extendDTO } from './DTO/RequestDTO';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { ChangeLoanStatus } from './DTO/ChangeLoanStatus.dto';
import { BookLoan } from './book-loan.entity';
import { ExtendLoanDTO } from './DTO/ExtendLoan.dto';

@ApiTags('booksLoan')
@Controller('book-loan')
export class BookLoanController {
  constructor(private bookLoanService: BookLoanService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBody({ type: CreateBookLoanDto })
  async createLoan(
    @Body() createBookLoanDto: CreateBookLoanDto,
  ): Promise<{ message: string }> {
    return this.bookLoanService.createLoan(createBookLoanDto);
  }

  @Post('children')
  @UseGuards(AuthGuard)
  @ApiBody({ type: CreateBookLoanDto })
  async createChildrenLoan(
    @Body() createBookLoanDto: CreateBookLoanDto,
  ): Promise<{ message: string }> {
    return this.bookLoanService.createChildrenLoan(createBookLoanDto);
  }
  @Post('/AdminLoan')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'asistente')
  @ApiBody({ type: CreateBookLoanDto })
  async createAdminLoan(
    @Body() createBookLoanDto: CreateBookLoanDto,
  ): Promise<{ message: string }> {
    return this.bookLoanService.createAdminLoan(createBookLoanDto);
  }

  @Post('/AdminLoan/children')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'asistente')
  @ApiBody({ type: CreateBookLoanDto })
  async createAdminChildrenLoan(
    @Body() createBookLoanDto: CreateBookLoanDto,
  ): Promise<{ message: string }> {
    return this.bookLoanService.createAdminChildrenLoan(createBookLoanDto);
  }

  @Patch('Approve')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async setInProcess(
    @Body() data: ChangeLoanStatus,
  ): Promise<{ message: string }> {
    return await this.bookLoanService.setInProcess(data);
  }

  @Patch('Refute')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async refuseLoan(
    @Body() data: ChangeLoanStatus,
  ): Promise<{ message: string }> {
    return await this.bookLoanService.refuseLoan(data);
  }

  @Patch('finalize')
  @UseGuards(AuthGuard)
  async CancelLoan(
    @Body() data: ChangeLoanStatus,
  ): Promise<{ message: string }> {
    return await this.bookLoanService.finalizeLoan(data);
  }

  @Patch('cancel')
  @UseGuards(AuthGuard)
  async finalizeLoan(
    @Body() data: ChangeLoanStatus,
  ): Promise<{ message: string }> {
    return await this.bookLoanService.cancelLoan(data);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') bookLoanId: number,
    @Body() updatedBookLoanDto: updatedBookLoan,
  ): Promise<{ message: string }> {
    return await this.bookLoanService.update(bookLoanId, updatedBookLoanDto);
  }

  @Get('in-progress')
  @UseGuards(AuthGuard)
  async getInProgressLoans(
    @Query() paginationDto: GETResponseDTO,
  ): Promise<{ data: BookLoan[]; count: number }> {
    return this.bookLoanService.getInProgressLoans(paginationDto);
  }

  @Get('pending')
  @UseGuards(AuthGuard)
  async getPendingLoans(
    @Query() paginationDto: GETResponseDTO,
  ): Promise<{ data: extendDTO[]; count: number }> {
    return this.bookLoanService.getPendingLoans(paginationDto);
  }

  @Get('completed')
  @UseGuards(AuthGuard)
  async getCompletedLoans(
    @Query() paginationDto: GETResponseDTO,
  ): Promise<{ data: BookLoan[]; count: number }> {
    return this.bookLoanService.getCompletedLoans(paginationDto);
  }

  // Este endpoint espera el estado del prestado
  @Get('Loan-List')
  @UseGuards(AuthGuard)
  async getLoansList(
    @Query() paginationDto: GETResponseDTO,
  ): Promise<{ data: BookLoanResponseDTO[]; count: number }> {
    return this.bookLoanService.getLoansList(paginationDto);
  }

  @Post('extend/:id')
  async extendLoan(
    @Param('id') bookLoanId: number,
    @Body() extendedDTO: ExtendLoanDTO,
  ): Promise<{ message: string }> {
    return this.bookLoanService.extendLoan(bookLoanId, extendedDTO);
  }
}
