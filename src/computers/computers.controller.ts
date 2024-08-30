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

} from '@nestjs/common';
import { ComputersService } from './computers.service';
import { ComputerDTO } from './DTO/create-computer.dto';
import { ApiBody, ApiOperation, ApiProperty, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ModifyComputerDTO } from './DTO/modify-computer.dto';
import { Computer } from './computer.entity';
import { PaginationQueryDTO } from './DTO/pagination-querry.dto';




@ApiTags('computers')
@Controller('computers')
export class ComputersController {
  constructor(private computerService: ComputersService) {}

@Post()
@ApiBody({type: ComputerDTO})
@ApiOperation({ summary: 'Create a new Computer equipment' })
@ApiResponse({
  status: 201, description: 'The Computer equipment has been successfully created.',
type : ComputerDTO})
addComputer(@Body() computerDTO: ComputerDTO) : Promise<ComputerDTO> {
  return  this.computerService.addComputer(computerDTO);
}
@Get(':EquipmentUniqueCode')
@ApiProperty({ description: 'Obtiene un equipo de cómputo  por su código' })
async findById(@Param('EquipmentUniqueCode') EquipmentUniqueCode: number): Promise<Computer> {
  try {
    return await this.computerService.findByEquipmentUniqueCode(EquipmentUniqueCode);
  } catch (error) {
    throw new NotFoundException(error.message);
  }
}

//controlador de modificación de un equipo de cómputo
@Put(':EquipmentUniqueCode')
@ApiOperation({ summary: 'Modify a Computer equipment' })
@ApiResponse({status: 201,description: 'The Computer equipment has been successfully Modifyed.'})
 async modifyComputer(
  @Param('EquipmentUniqueCode') EquipmentUniqueCode: number,
  @Body() modifyComputerDTO : ModifyComputerDTO
) {
  return await this.computerService.modifyComputer(
    EquipmentUniqueCode,
    modifyComputerDTO,
  );
}

//metodo desabilitar un equipo de cómputo
@Patch(':EquipmentUniqueCode')
  @ApiOperation({ summary: 'Inactivates a computer equipment ' })
  @ApiResponse({status: 201,description: 'The Computer equipment has been successfully inactivated.'})
 async DisableEquipment(@Param('EquipmentUniqueCode') EquipmentUniqueCode: number) {
    return await this.computerService.DisableEquipment(EquipmentUniqueCode);
    
  }
  //método para ver todo con filtro y paginado
@Get()
@ApiOperation({ summary: 'get all equipments and filters' })
@ApiResponse({ status: 200, description: 'List of equipments computer, filters and pager',
   type: [Computer] })
async getAllComputers(@Query() paginationDTO: PaginationQueryDTO ) {
  return await this.computerService.getAllComputers(paginationDTO)
}

}



