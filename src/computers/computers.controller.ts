import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ComputersService } from './computers.service';
import { ComputerDTO } from './DTO/create-computer.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDTO } from './DTO/pagination-querry.dto';
import { ComputerModifyDTO } from './DTO/modify-computer.dto';

@ApiTags('computers')
@Controller('computers')
export class ComputersController {
  constructor(private computerService: ComputersService) {}
  // controlador para crear un equipo de cómputo
  @Post()
  @ApiOperation({ summary: 'Create a new Computer equipment' })
  @ApiResponse({
    status: 201,
    description: 'The Computer equipment has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  addComputer(@Body() computerDTO: ComputerDTO) {
    return this.computerService.addComputer(computerDTO);
  }

  // controlador para ver todos los equipos de cómputo activos
  @Get('active')
  @ApiOperation({ summary: 'Find all activated Computer equipment' })
  @ApiResponse({
    status: 201,
    description: 'The Computer equipments has been successfully found.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiQuery({ name: 'Limit', required: false, type: Number })
  @ApiQuery({ name: 'Offset', required: false, type: Number })
  getComputersActive(@Query() pagination: PaginationQueryDTO) {
    return this.computerService.getActiveComputers(pagination);
  }

  // controlador para ver todos los equipos de cómputo.
  @Get()
  @ApiOperation({ summary: 'Find all Computer equipment' })
  @ApiResponse({
    status: 201,
    description: 'The Computer equipments has been successfully finded.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiQuery({ name: 'Limit', required: false, type: Number })
  @ApiQuery({ name: 'Offset', required: false, type: Number })
  getComputers(@Query() pagination: PaginationQueryDTO) {
    return this.computerService.getComputers(pagination);
  }

  // controlador para modificar un equipo de cómputo
  @Put(':EquipmentUniqueCode')
  @ApiOperation({ summary: 'Modify a Computer equipment' })
  @ApiResponse({
    status: 201,
    description: 'The Computer equipment has been successfully Modifyed.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  modifyComputer(
    @Param('EquipmentUniqueCode') EquipmentUniqueCode: number,
    @Body() computerModifyDTO: ComputerModifyDTO,
  ) {
    return this.computerService.modifyComputer(
      EquipmentUniqueCode,
      computerModifyDTO,
    );
  }

  // controlador para deshabilitar un equipo de cómputo
  @Patch(':EquipmentUniqueCode')
  @ApiOperation({ summary: 'Inactivates a computer equipment ' })
  @ApiResponse({
    status: 201,
    description: 'The Computer equipment has been successfully inactivated.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  DisableEquipment(@Param('EquipmentUniqueCode') EquipmentUniqueCode: number) {
    return this.computerService.DisableEquipment(EquipmentUniqueCode);
  }

  // controlador para buscar un equipo de cómputo por su código único
  @Get(':EquipmentUniqueCode')
  @ApiOperation({ summary: 'Find a Computer equipment by his unique code' })
  @ApiResponse({
    status: 201,
    description: 'The Computer equipment has been successfully Finded.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  FindById(@Param('EquipmentUniqueCode') EquipmentUniqueCode: number) {
    return this.computerService.FindById(EquipmentUniqueCode);
  }

  // controlador para buscar un equipo de cómputo por su número de máquina
  @Get('machine/:MachineNumber')
  @ApiOperation({ summary: 'Find a Computer equipment by machine number' })
  @ApiResponse({
    status: 201,
    description: 'The Computer equipments has been successfully Finded.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiQuery({ name: 'Limit', required: false, type: Number })
  @ApiQuery({ name: 'Offset', required: false, type: Number })
  async FindByMachineNumber(
    @Param('MachineNumber') MachineNumber: number,
    @Query() pagination: PaginationQueryDTO,
  ) {
    return this.computerService.FindByMachineNumber(MachineNumber, pagination);
  }

  // controlador para buscar un equipo de cómputo por su marca
  @Get('brand/:EquipmentBrand')
  @ApiOperation({ summary: 'Find a Computer equipment by brand' })
  @ApiResponse({
    status: 201,
    description: 'The Computer equipments has been successfully Finded.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiQuery({ name: 'Limit', required: false, type: Number })
  @ApiQuery({ name: 'Offset', required: false, type: Number })
  async FindByBrand(
    @Param('EquipmentBrand') EquipmentBrand: string,
    @Query() pagination: PaginationQueryDTO,
  ) {
    return this.computerService.FindByBrand(EquipmentBrand, pagination);
  }
}
