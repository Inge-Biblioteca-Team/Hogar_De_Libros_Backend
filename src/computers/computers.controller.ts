/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ComputersService } from './computers.service';
import { ComputerDTO } from './DTO/create-computer.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ModifyComputerDTO } from './DTO/modify-computer.dto';
import { Computer } from './computer.entity';
import { PaginationQueryDTO } from './DTO/pagination-querry.dto';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@ApiTags('computers')
@Controller('computers')
export class ComputersController {
  constructor(private computerService: ComputersService) {}


 // Cambiar a promise message, 
  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'asistente')
  addComputer(@Body() computerDTO: ComputerDTO): Promise<ComputerDTO> {
    return this.computerService.createComputer(computerDTO);
  }

 
  @Get(':EquipmentUniqueCode')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'asistente')
  async findById(
    @Param('EquipmentUniqueCode') EquipmentUniqueCode: number,
  ): Promise<Computer> {
    try {
      return await this.computerService.findByEquipmentUniqueCode(
        EquipmentUniqueCode,
      );
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new NotFoundException(errorMessage);
    }
  }

 // Cambiar a promise message, 
  @Put(':EquipmentUniqueCode')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async modifyComputer(
    @Param('EquipmentUniqueCode') EquipmentUniqueCode: number,
    @Body() modifyComputerDTO: ModifyComputerDTO,
  ) {
    return await this.computerService.modifyComputer(
      EquipmentUniqueCode,
      modifyComputerDTO,
    );
  }

  // Cambiar a promise message, 
  @Patch(':EquipmentUniqueCode')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async DisableEquipment(
    @Param('EquipmentUniqueCode') EquipmentUniqueCode: number,
  ) {
    return await this.computerService.DisableEquipment(EquipmentUniqueCode);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'asistente')
  async getAllComputers(@Query() paginationDTO: PaginationQueryDTO) {
    return await this.computerService.getAllComputers(paginationDTO);
  }

  @Get('workstation/Status')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'asistente', 'recepcion')
  async getStatusWorkStation(): Promise<
    { MachineNumber: number; Status: string }[]
  > {
    return await this.computerService.getStatusWorkStation();
  }
// PROMISE MESSAGE y dto parcial
  @Patch(':machineNumber/maintenance')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async setWorkStationToMaintenance(
    @Param('machineNumber') machineNumber: number,
    @Body('location') location: string,
    @Body('userName') userName: string,
  ): Promise<string> {
    return this.computerService.SetWorkStationToMaintenance(
      machineNumber,
      location,
      userName,
    );
  }
// PROMISE MESSAGE
  @Patch(':machineNumber/available')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async setWorkStationToAvailable(
    @Param('machineNumber') machineNumber: number,
  ): Promise<string> {
    return this.computerService.ResetWorkStation(machineNumber);
  }
// PROMISE MESSAGE
  @Patch(':machineNumber/reactive')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async ReactiveMachine(
    @Param('machineNumber') machineNumber: number,
  ): Promise<string> {
    return this.computerService.ReactiveMachine(machineNumber);
  }
}
