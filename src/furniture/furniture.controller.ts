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
import { ApiTags } from '@nestjs/swagger';
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
  @Roles('admin', 'asistente')
  async create(
    @Body() createFurnitureDto: CreateFurnitureDto,
  ): Promise<{message: string}> {
    return this.furnitureService.create(createFurnitureDto);
  }

  @Get()
  @Roles('admin', 'asistente')
  async findAll(@Query() query: PaginatedDTO) {
    return this.furnitureService.findAll(query);
  }

  @Get(':id')
  @Roles('admin', 'asistente')
  async findOne(@Param('id') id: number): Promise<Furniture> {
    return this.furnitureService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  async update(
    @Param('id') id: number,
    @Body() updateFurniture: CreateFurnitureDto,
  ): Promise<{message: string}> {
    return this.furnitureService.update(id, updateFurniture);
  }


  @Patch(':id/Down')
  @Roles('admin')
  async DownFurniture(@Param('id') Id: number): Promise<{message: string}> {
    return await this.furnitureService.DowFurniture(Id);
  }

  @Patch(':id/NA')
  @Roles('admin')
  async NAFurniture(@Param('id') Id: number): Promise<{message: string}> {
    return await this.furnitureService.NAFurniture(Id);
  }

  @Patch(':id/SE')
  @Roles('admin')
  async SEFurniture(@Param('id') Id: number): Promise<{message: string}> {
    return await this.furnitureService.SEFurniture(Id);
  }
}
