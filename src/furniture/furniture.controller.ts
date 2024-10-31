/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FurnitureService } from './furniture.service';
import { CreateFurnitureDto } from './DTO/create-furniture.dto';
import { Furniture } from './furniture.entity';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginatedDTO } from './DTO/PaginationQueryDTO';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
@ApiTags('Furniture')
@Controller('furniture')
@UseGuards(AuthGuard, RolesGuard)
export class FurnitureController {
  constructor(private readonly furnitureService: FurnitureService) {}

  @Post()
  @Roles('Admin', 'Asistente')
  @ApiOperation({ summary: 'Create a new Furniture' })
  @ApiBody({ type: CreateFurnitureDto })
  async create(
    @Body() createFurnitureDto: CreateFurnitureDto,
  ): Promise<Furniture> {
    return this.furnitureService.create(createFurnitureDto);
  }

  @Get()
  @Roles('Admin', 'Asistente')
  @ApiOperation({ summary: 'Get all paginated' })
  async findAll(@Query() query: PaginatedDTO) {
    return this.furnitureService.findAll(query);
  }

  @Get(':id')
  @Roles('Admin', 'Asistente')
  @ApiOperation({ summary: 'Get Furniture by ID for See operation' })
  async findOne(@Param('id') id: number): Promise<Furniture> {
    return this.furnitureService.findOne(id);
  }

  @Patch(':id')
  @Roles('Admin')
  @ApiOperation({ summary: 'Edit register' })
  @ApiBody({ type: CreateFurnitureDto })
  async update(
    @Param('id') id: number,
    @Body() updateFurniture: CreateFurnitureDto,
  ): Promise<Furniture> {
    return this.furnitureService.update(id, updateFurniture);
  }

  @Patch(':id/Down')
  @Roles('Admin')
  @ApiOperation({ summary: 'Change Status to Baja' })
  async DownFurniture(@Param('id') Id: number) {
    return await this.furnitureService.DowFurniture(Id);
  }

  @Patch(':id/NA')
  @Roles('Admin')
  @ApiOperation({ summary: 'Change Status To N.A.' })
  async NAFurniture(@Param('id') Id: number) {
    return await this.furnitureService.NAFurniture(Id);
  }

  @Patch(':id/SE')
  @Roles('Admin')
  @ApiOperation({ summary: 'Change Status To S.E.' })
  async SEFurniture(@Param('id') Id: number) {
    return await this.furnitureService.SEFurniture(Id);
  }
}
