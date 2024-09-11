/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Patch, Param, Get, Query } from '@nestjs/common';
import { FurnitureService } from './furniture.service';
import { CreateFurnitureDto } from './DTO/create-furniture.dto';
import { Furniture } from './furniture.entity';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginatedDTO } from './DTO/PaginationQueryDTO';

@ApiTags('Furniture')
@Controller('furniture')
export class FurnitureController {
  constructor(private readonly furnitureService: FurnitureService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Furniture' })
  @ApiBody({ type: CreateFurnitureDto })
  async create(
    @Body() createFurnitureDto: CreateFurnitureDto,
  ): Promise<Furniture> {
    return this.furnitureService.create(createFurnitureDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all paginated' })
  async findAll(@Query() query: PaginatedDTO) {
    return this.furnitureService.findAll(query);
  }


  @Get(':id')
  @ApiOperation({ summary: 'Get Furniture by ID for See operation' })
  async findOne(@Param('id') id: number): Promise<Furniture> {
    return this.furnitureService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Edit register' })
  @ApiBody({ type: CreateFurnitureDto })
  async update(
    @Param('id') id: number,
    @Body() updateFurniture: CreateFurnitureDto,
  ): Promise<Furniture> {
    return this.furnitureService.update(id, updateFurniture);
  }

  @Patch(':id/Down')
  @ApiOperation({ summary: 'Change Status to Baja' })
  async DownFurniture(@Param('id') Id: number) {
    return await this.furnitureService.DowFurniture(Id);
  }

  @Patch(':id/SE')
  @ApiOperation({ summary: 'Change Status To S.E.' })
  async SEFurniture(@Param('id') Id: number) {
    return await this.furnitureService.NAFurniture(Id);
  }
}
