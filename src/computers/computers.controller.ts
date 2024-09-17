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


  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
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
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Get(':EquipmentUniqueCode')
  @ApiProperty({ description: 'Obtiene un equipo de cómputo  por su código' })
  async findById(
    @Param('EquipmentUniqueCode') EquipmentUniqueCode: number,
  ): Promise<Computer> {
    try {
      return await this.computerService.findByEquipmentUniqueCode(
        EquipmentUniqueCode,
      );
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }


  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  //controlador de modificación de un equipo de cómputo
  @Put(':EquipmentUniqueCode')
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
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  //metodo desabilitar un equipo de cómputo
  @Patch(':EquipmentUniqueCode')
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

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'external_user')
  //método para ver todo con filtro y paginado
  @Get()
  @ApiOperation({ summary: 'get all equipments and filters' })
  @ApiResponse({
    status: 200,
    description: 'List of equipments computer, filters and pager',
    type: [Computer],
  })
  async getAllComputers(@Query() paginationDTO: PaginationQueryDTO) {
    return await this.computerService.getAllComputers(paginationDTO);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin','external_user')
  @Get('workstation/Status')
  @ApiOperation({ summary: 'Watch the status of a workstation ' })
  @ApiResponse({
    status: 200,
    description: 'The WorkStation status has been finded.',
  })
  async getStatusWorkStation(): Promise<{MachineNumber: number, Status: string}[]> {
    return await this.computerService.getStatusWorkStation();
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':machineNumber/maintenance')
  async setWorkStationToMaintenance(
    @Param('machineNumber') machineNumber: number,
    @Body('location') location: string,
    @Body('userName') userName: string
  ): Promise<string> {
    return this.computerService.SetWorkStationToMaintenance(machineNumber, location, userName);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':machineNumber/available')
  async setWorkStationToAvailable(
    @Param('machineNumber') machineNumber: number
  ): Promise<string> {
    return this.computerService.ResetWorkStation(machineNumber);
  }
  
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':machineNumber/reactive')
  async ReactiveMachine(
    @Param('machineNumber') machineNumber: number
  ): Promise<string> {
    return this.computerService.ReactiveMachine(machineNumber);
  }

 
}
