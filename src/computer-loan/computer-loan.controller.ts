/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ComputerLoanService } from './computer-loan.service';
import { CreateComputerLoanDto } from './DTO/create-computer-loan.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @ApiResponse({
    status: 200,
    description: 'Lista de préstamos',
    type: [ComputerLoan],
  })
  async getAllComputerLoans(@Query() paginationQuery: PaginationQueryDTO) {
    const { data, count } =
      await this.computerLoanService.getAllComputerLoans(paginationQuery);
    return { data, count };
  }

  @Patch('/finish/:machineNumber')
  @ApiOperation({
    summary: 'Finalizar un préstamo de cómputo por número de máquina',
  })
  @ApiResponse({
    status: 200,
    description: 'Préstamo finalizado',
  })
  @ApiResponse({ status: 404, description: 'Préstamo no encontrado' })
  async finish(@Param('machineNumber') machineNumber: number): Promise<string> {
    return this.computerLoanService.FinishComputerLoanByMachineNumber(
      machineNumber,
    );
  }
}
