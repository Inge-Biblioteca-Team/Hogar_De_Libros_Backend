import { Body, Controller, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ComputerLoanService } from './computer-loan.service';
import { CreateComputerLoanDto } from './DTO/create-computer-loan.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateComputerLoanDto } from './DTO/update-computer-loan.dto';
import { PaginationQueryDTO } from './DTO/Pagination-querry.dto';
import { ComputerLoan } from './computer-loan.entity';

@ApiTags('ComputerLoan')
@Controller('computer-loan')
export class ComputerLoanController {
  constructor(private computerLoanService: ComputerLoanService) {}

  @Post()
  CreateComputerLoan(@Body() createComputerLoanDto: CreateComputerLoanDto) {
    return this.computerLoanService.CreateComputerLoan(createComputerLoanDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los préstamos con paginación' })
  @ApiResponse({ status: 200, description: 'Lista de préstamos', type: [ComputerLoan] })
  async getAllComputerLoans(
    @Query() paginationQuery: PaginationQueryDTO,
  ) {
    const { data, count } = await this.computerLoanService.getAllComputerLoans(paginationQuery);
    return { data, count };
  }

  @Patch(':ComputerLoanId')
  AcceptComputerLoanRequest(@Param('ComputerLoanId') ComputerLoanId: number) {
    return this.computerLoanService.AcceptComputerLoanRequest(ComputerLoanId);
  }

  @Patch(':ComputerLoanId')
  CancelComputerLoanRequest(@Param('ComputerLoanId') ComputerLoanId: number) {
    return this.computerLoanService.CancelComputerLoanRequest(ComputerLoanId);
  }

  @Put(':ComputerLoanId')
  ModifyComputerLoanRequest(
    @Param('ComputerLoanId') ComputerLoanId: number,
    @Body() updateComputerLoanDto: UpdateComputerLoanDto,
  ) {
    return this.computerLoanService.ModifyComputerLoanRequest(
      ComputerLoanId,
      updateComputerLoanDto,
    );
  }
}
