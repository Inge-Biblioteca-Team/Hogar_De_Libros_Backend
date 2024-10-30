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
import { Role } from 'src/user/user.entity';

@ApiTags('computers')
@Controller('computers')
@UseGuards(AuthGuard, RolesGuard)
export class ComputersController {
  constructor(private computerService: ComputersService) {}

  @ApiBearerAuth('access-token')

  @Post()
  @Roles(Role.Admin, Role.Creator)
  @ApiBody({ type: ComputerDTO })
  @ApiOperation({ summary: 'Create a new Computer equipment' })
  @ApiResponse({
    status: 201,
    description: 'The Computer equipment has been successfully created.',
    type: ComputerDTO,
  })
  addComputer(@Body() computerDTO: ComputerDTO): Promise<ComputerDTO> {
    return this.computerService.createComputer(computerDTO);
  }

  @ApiBearerAuth('access-token')
  @Get(':EquipmentUniqueCode')
  @Roles(Role.Admin, Role.Creator)
  @ApiProperty({ description: 'Obtiene un equipo de cómputo  por su código' })
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

  @ApiBearerAuth('access-token')
  @Put(':EquipmentUniqueCode')
  @Roles(Role.Admin, Role.Creator)
  @ApiOperation({ summary: 'Modify a Computer equipment' })
  @ApiResponse({
    status: 201,
    description: 'The Computer equipment has been successfully Modifyed.',
  })
  async modifyComputer(
    @Param('EquipmentUniqueCode') EquipmentUniqueCode: number,
    @Body() modifyComputerDTO: ModifyComputerDTO,
  ) {
    return await this.computerService.modifyComputer(
      EquipmentUniqueCode,
      modifyComputerDTO,
    );
  }

  @ApiBearerAuth('access-token')
  @Patch(':EquipmentUniqueCode')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Inactivates a computer equipment ' })
  @ApiResponse({
    status: 201,
    description: 'The Computer equipment has been successfully inactivated.',
  })
  async DisableEquipment(
    @Param('EquipmentUniqueCode') EquipmentUniqueCode: number,
  ) {
    return await this.computerService.DisableEquipment(EquipmentUniqueCode);
  }

  @Get()
  @Roles(Role.Admin, Role.Creator, Role.ExternalUser, Role.Reception)
  @ApiOperation({ summary: 'get all equipments and filters' })
  @ApiResponse({
    status: 200,
    description: 'List of equipments computer, filters and pager',
    type: [Computer],
  })
  async getAllComputers(@Query() paginationDTO: PaginationQueryDTO) {
    return await this.computerService.getAllComputers(paginationDTO);
  }

  @Get('workstation/Status')
  @Roles(Role.Admin, Role.Creator)
  @ApiResponse({
    status: 200,
    description: 'The WorkStation status has been finded.',
  })
  async getStatusWorkStation(): Promise<
    { MachineNumber: number; Status: string }[]
  > {
    return await this.computerService.getStatusWorkStation();
  }

  @Patch(':machineNumber/maintenance')
  @Roles(Role.Admin, Role.Creator)
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

  @Patch(':machineNumber/available')
  @Roles(Role.Admin, Role.Creator)
  async setWorkStationToAvailable(
    @Param('machineNumber') machineNumber: number,
  ): Promise<string> {
    return this.computerService.ResetWorkStation(machineNumber);
  }

  @Patch(':machineNumber/reactive')
  @Roles(Role.Admin)
  async ReactiveMachine(
    @Param('machineNumber') machineNumber: number,
  ): Promise<string> {
    return this.computerService.ReactiveMachine(machineNumber);
  }
}
