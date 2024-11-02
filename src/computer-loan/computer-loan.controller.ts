/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ComputerLoanService } from './computer-loan.service';
import { CreateComputerLoanDto } from './DTO/create-computer-loan.dto';
import {ApiTags } from '@nestjs/swagger';
import { PaginationQueryDTO } from './DTO/Pagination-querry.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { UpdateComputerLoanDto } from './DTO/update-computer-loan.dto';

@ApiTags('ComputerLoan')
@Controller('computer-loan')
@UseGuards(AuthGuard, RolesGuard)
export class ComputerLoanController {
  constructor(private computerLoanService: ComputerLoanService) {}

   // Cambiar a promise message, 
  @Post()
  @Roles('admin', 'asistente', 'recepcion')
  CreateComputerLoan(@Body() createComputerLoanDto: CreateComputerLoanDto) {
    return this.computerLoanService.CreateComputerLoan(createComputerLoanDto);
  }
  @Patch()
  @Roles('admin', 'asistente', 'recepcion')
  finalizeLoan(@Body() data:UpdateComputerLoanDto) {
    return this.computerLoanService.FinalizeComputerLoan(data);
  }

  @Get()
  @Roles('admin', 'asistente', 'recepcion')
  async getAllComputerLoans(@Query() paginationQuery: PaginationQueryDTO) {
    const { data, count } =
      await this.computerLoanService.getAllComputerLoans(paginationQuery);
    return { data, count };
  }

}
