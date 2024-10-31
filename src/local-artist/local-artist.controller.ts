/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LocalArtistService } from './local-artist.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginatedQueryDTO } from './DTO/Paginated-Query';
import { CreateLocalArtistDTO } from './DTO/create-local-artist.dto';
import { LocalArtist } from './local-artist.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
@ApiTags('localArtist')
@Controller('local-artist')
export class LocalArtistController {
  constructor(private readonly localArtistService: LocalArtistService) {}


  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('Admin', 'Asistente')
  @ApiOperation({ summary: 'Create a new local artist' })
  @ApiBody({ type: CreateLocalArtistDTO })
  @ApiResponse({ status: 201, description: 'Artist created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(
    @Body() createLocalArtistDto: CreateLocalArtistDTO,
  ): Promise<LocalArtist> {
    return this.localArtistService.create(createLocalArtistDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get a paginated list of local artists' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of local artists',
    type: LocalArtist,
    isArray: true,
  })
  async findAll(
    @Query() query: PaginatedQueryDTO,
  ): Promise<{ data: LocalArtist[]; count: number }> {
    return this.localArtistService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a local artist by ID' })
  @ApiResponse({ status: 200, description: 'Artist found', type: LocalArtist })
  @ApiResponse({ status: 400, description: 'Invalid ID format.' })
  @ApiResponse({ status: 404, description: 'Artist not found.' })
  async findOne(@Param('id') id: number): Promise<LocalArtist> {
    return this.localArtistService.findOne(id);
  }

 
  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('Admin')
  @ApiOperation({ summary: 'Update a local artist' })
  @ApiBody({ type: CreateLocalArtistDTO })
  @ApiResponse({ status: 200, description: 'Artist updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid ID format or bad request.' })
  async update(
    @Param('id') id: number,
    @Body() updateLocalArtistDto: CreateLocalArtistDTO,
  ): Promise<LocalArtist> {
    return this.localArtistService.update(id, updateLocalArtistDto);
  }

 
  @Patch(':id/Down')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('Admin')
  @ApiOperation({ summary: 'Disable a local artist' })
  @ApiResponse({ status: 200, description: 'Artist disabled successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid ID format.' })
  @ApiResponse({ status: 404, description: 'Artist not found.' })
  @ApiResponse({
    status: 200,
    description: 'El artista ha sido dado de baja correctamente',
  })
  async DisableArtist(@Param('id') ArtistID: number) {
    return await this.localArtistService.DownArtist(ArtistID);
  }
}
