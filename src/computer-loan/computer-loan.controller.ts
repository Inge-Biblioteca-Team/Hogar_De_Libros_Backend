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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDTO } from './DTO/Pagination-querry.dto';
import { ComputerLoan } from './computer-loan.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { Role } from 'src/user/user.entity';

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

  @Get()
  @Roles('admin', 'asistente', 'recepcion')
  async getAllComputerLoans(@Query() paginationQuery: PaginationQueryDTO) {
    const { data, count } =
      await this.computerLoanService.getAllComputerLoans(paginationQuery);
    return { data, count };
  }

   // Cambiar a promise message, 
  @Patch('/finish/:machineNumber')
  @Roles('admin', 'asistente', 'recepcion')
  async finish(@Param('machineNumber') machineNumber: number): Promise<string> {
    return this.computerLoanService.FinishComputerLoanByMachineNumber(
      machineNumber,
    );
  }
}
