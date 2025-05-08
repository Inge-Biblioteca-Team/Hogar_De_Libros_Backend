/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query
} from '@nestjs/common';
import { ComputerLoanService } from './computer-loan.service';
import { CreateComputerLoanDto } from './DTO/create-computer-loan.dto';
import {ApiTags } from '@nestjs/swagger';
import { PaginationQueryDTO } from './DTO/Pagination-querry.dto';
import { UpdateComputerLoanDto } from './DTO/update-computer-loan.dto';

@ApiTags('ComputerLoan')
@Controller('computer-loan')
export class ComputerLoanController {
  constructor(private computerLoanService: ComputerLoanService) {}

   // Cambiar a promise message, 
  @Post()
  CreateComputerLoan(@Body() createComputerLoanDto: CreateComputerLoanDto) {
    return this.computerLoanService.CreateComputerLoan(createComputerLoanDto);
  }
  @Patch()
  finalizeLoan(@Body() data:UpdateComputerLoanDto) {
    return this.computerLoanService.FinalizeComputerLoan(data);
  }

  @Get()
  async getAllComputerLoans(@Query() paginationQuery: PaginationQueryDTO) {
    const { data, count } =
      await this.computerLoanService.getAllComputerLoans(paginationQuery);
    return { data, count };
  }

}
