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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginatedDTO } from './DTO/PaginationQueryDTO';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('Furniture')
@Controller('furniture')
export class FurnitureController {
  constructor(private readonly furnitureService: FurnitureService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'creator')
  @Post()
  @ApiOperation({ summary: 'Create a new Furniture' })
  @ApiBody({ type: CreateFurnitureDto })
  async create(
    @Body() createFurnitureDto: CreateFurnitureDto,
  ): Promise<Furniture> {
    return this.furnitureService.create(createFurnitureDto);
  }

  @ApiBearerAuth('access-token')
  @Get()
  @ApiOperation({ summary: 'Get all paginated' })
  async findAll(@Query() query: PaginatedDTO) {
    return this.furnitureService.findAll(query);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'creator')
  @Get(':id')
  @ApiOperation({ summary: 'Get Furniture by ID for See operation' })
  async findOne(@Param('id') id: number): Promise<Furniture> {
    return this.furnitureService.findOne(id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'creator')
  @Patch(':id')
  @ApiOperation({ summary: 'Edit register' })
  @ApiBody({ type: CreateFurnitureDto })
  async update(
    @Param('id') id: number,
    @Body() updateFurniture: CreateFurnitureDto,
  ): Promise<Furniture> {
    return this.furnitureService.update(id, updateFurniture);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/Down')
  @ApiOperation({ summary: 'Change Status to Baja' })
  async DownFurniture(@Param('id') Id: number) {
    return await this.furnitureService.DowFurniture(Id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/NA')
  @ApiOperation({ summary: 'Change Status To N.A.' })
  async NAFurniture(@Param('id') Id: number) {
    return await this.furnitureService.NAFurniture(Id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/SE')
  @ApiOperation({ summary: 'Change Status To S.E.' })
  async SEFurniture(@Param('id') Id: number) {
    return await this.furnitureService.SEFurniture(Id);
  }
}
