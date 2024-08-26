import { Body, Controller, Get, Post } from '@nestjs/common';
import { ComputersService } from './computers.service';
import { ComputerDTO } from './DTO/create-computer.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('computers')
@Controller('computers')
export class ComputersController {
    constructor(private computerService: ComputersService){}

    @Post()
    @ApiBody({ type: ComputerDTO })
    @ApiResponse({ status: 201, description: 'Create a new computer', type: ComputerDTO })
    addComputer(@Body() computerDTO: ComputerDTO){
        return this.computerService.addComputer(computerDTO);
    }

    @Get()
    getComputers(){
        return this.computerService.getComputers();
    }
}
