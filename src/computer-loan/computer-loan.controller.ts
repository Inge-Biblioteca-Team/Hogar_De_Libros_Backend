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
import { ComputerLoanService } from './computer-loan.service';
import { CreateComputerLoanDto } from './DTO/create-computer-loan.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDTO } from './DTO/Pagination-querry.dto';
import { ComputerLoan } from './computer-loan.entity';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('ComputerLoan')
@Controller('computer-loan')
export class ComputerLoanController {
  constructor(private computerLoanService: ComputerLoanService) {}

  @Post()
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  CreateComputerLoan(@Body() createComputerLoanDto: CreateComputerLoanDto) {
    return this.computerLoanService.CreateComputerLoan(createComputerLoanDto);
  }

  @Get()
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
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
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
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
