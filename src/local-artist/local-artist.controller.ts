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
import { ApiTags } from '@nestjs/swagger';
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
  @Roles('admin', 'asistente')
  async create(
    @Body() createLocalArtistDto: CreateLocalArtistDTO,
  ): Promise<{message: string}> {
    return await this.localArtistService.create(createLocalArtistDto);
  }

  @Get()
  async findAll(
    @Query() query: PaginatedQueryDTO,
  ): Promise<{ data: LocalArtist[]; count: number }> {
    return await this.localArtistService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<LocalArtist> {
    return await this.localArtistService.findOne(id);
  }


  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async update(
    @Param('id') id: number,
    @Body() updateLocalArtistDto: CreateLocalArtistDTO,
  ): Promise<{message: string}> {
    return await this.localArtistService.update(id, updateLocalArtistDto);
  }

  @Patch(':id/Down')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async DisableArtist(@Param('id') ArtistID: number): Promise <{message: string}> {
    return await this.localArtistService.DownArtist(ArtistID);
  }

  @Patch(':id/Up')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async EnableArtist(@Param('id') ArtistID: number): Promise <{message: string}> {
    return await this.localArtistService.UpArtist(ArtistID);
  }
}
