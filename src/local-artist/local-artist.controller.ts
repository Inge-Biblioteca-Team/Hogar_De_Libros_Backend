/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { LocalArtistService } from './local-artist.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginatedQueryDTO } from './DTO/Paginated-Query';
import { CreateLocalArtistDTO } from './DTO/create-local-artist.dto';
import { LocalArtist } from './local-artist.entity';

@ApiTags('localArtist')
@Controller('local-artist')
export class LocalArtistController {
  constructor(private readonly localArtistService: LocalArtistService) {}

  @Post()
  async create(
    @Body() createLocalArtistDto: CreateLocalArtistDTO,
  ): Promise<LocalArtist> {
    return this.localArtistService.create(createLocalArtistDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Lista de artistas con paginación',
  })
  async findAll(
    @Query() query: PaginatedQueryDTO,
  ): Promise<{ data: LocalArtist[]; count: number }> {
    return this.localArtistService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<LocalArtist> {
    const idNumber = parseInt(id, 10);
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }
    return this.localArtistService.findOne(idNumber);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateLocalArtistDto: CreateLocalArtistDTO,
  ): Promise<LocalArtist> {
    const idNumber = parseInt(id, 10);
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }
    return this.localArtistService.update(idNumber, updateLocalArtistDto);
  }

  @Patch(':id/Down')
  @ApiResponse({
    status: 200,
    description: 'El artista ha sido dado de baja correctamente',
  })
  async DisableArtist(@Param('id') ArtistID: number) {
    return await this.localArtistService.DownArtist(ArtistID);
  }
}
