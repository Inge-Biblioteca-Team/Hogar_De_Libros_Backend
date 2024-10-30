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
  UseGuards,
} from '@nestjs/common';
import { BookLoanService } from './book-loan.service';
import {  ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateBookLoanDto } from './DTO/create-book-loan.dto';
import { BookLoan } from './book-loan.entity';
import { FinalizeBookLoanDto } from './DTO/finalize-bookloan.dto';
import { updatedBookLoan } from './DTO/update-bookLoan.dto';
import { GETResponseDTO } from './DTO/GETSResponse';
import { BookLoanResponseDTO } from './DTO/RequestDTO';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { Role } from 'src/user/user.entity';

@ApiTags('booksLoan')
@Controller('book-loan')
@UseGuards(AuthGuard, RolesGuard)
export class BookLoanController {
  constructor(private bookLoanService: BookLoanService) {}

  @Post()
  @Roles(Role.Admin, Role.Creator, Role.ExternalUser)
  @ApiBody({ type: CreateBookLoanDto })
  async createLoan(
    @Body() createBookLoanDto: CreateBookLoanDto,
  ): Promise<{message:string}> {
    return this.bookLoanService.createLoan(createBookLoanDto);
  }

  @Patch(':id/in-process')
  @Roles(Role.Admin)
  async setInProcess(@Param('id') bookLoanId: number): Promise<BookLoan> {
    const updatedBookLoan = await this.bookLoanService.setInProcess(bookLoanId);
    if (!updatedBookLoan) {
      throw new NotFoundException(
        `Préstamo de libro con ID ${bookLoanId} no encontrado`,
      );
    }
    return updatedBookLoan;
  }

  
  @Patch(':id/finalize')
  @Roles(Role.Admin)
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

  @Patch(':id')
  @Roles(Role.Admin, Role.Creator, Role.ExternalUser)
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


  @Get('in-progress')
  @Roles(Role.Admin, Role.Creator, Role.ExternalUser, Role.Reception)
  async getInProgressLoans(
    @Query() paginationDto: GETResponseDTO,
  ): Promise<{ data: BookLoanResponseDTO[]; count: number }> {
    return this.bookLoanService.getInProgressLoans(paginationDto);
  }


  @Get('pending')
  @Roles(Role.Admin, Role.Creator, Role.ExternalUser, Role.Reception)
  async getPendingLoans(
    @Query() paginationDto: GETResponseDTO,
  ): Promise<{ data: BookLoanResponseDTO[]; count: number }> {
    return this.bookLoanService.getPendingLoans(paginationDto);
  }


  @Get('completed')
  @Roles(Role.Admin, Role.Creator, Role.ExternalUser, Role.Reception)
  async getCompletedLoans(
    @Query() paginationDto: GETResponseDTO,
  ): Promise<{ data: BookLoanResponseDTO[]; count: number }> {
    return this.bookLoanService.getCompletedLoans(paginationDto);
  }
}
