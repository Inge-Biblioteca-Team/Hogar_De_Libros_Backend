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
  Delete,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import {  ApiTags } from '@nestjs/swagger';
import { getRoomDto } from './dto/get-pagination.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
@ApiTags('rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'asistente')
  async create(
    @Body() createRoomDto: CreateRoomDto
  ): Promise<{ message: string; roomID?: number }> {
    return this.roomsService.create(createRoomDto);
  }

  @Get()
  async findAllRooms(
    @Query() filter: getRoomDto,
  ): Promise<{ data: CreateRoomDto[]; count: number }> {
    return this.roomsService.findAllRooms(filter);
  }

  @Get('table')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'asistente', 'institucional')
  async findAllRoomsTable(): Promise<CreateRoomDto[]> {
    return this.roomsService.findAllRoomsTable();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async update(
    @Param('id') id: string,
    @Body() updateRoomDto: UpdateRoomDto
  ): Promise<{ message: string }> {
    return this.roomsService.update(+id, updateRoomDto);
  }

  @Patch('maintenance/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async updateStatusMaintenance(
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    return this.roomsService.updateStatusMaintenance(+id);
  }

  @Patch('closed/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async updateStatusClosed(
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    return this.roomsService.updateStatusClosed(+id);
  }

  @Patch('available/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async updateStatusAvailable(
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    return this.roomsService.updateStatusAvailable(+id);
  }

  @Delete('Delete/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async deleteRoom(@Param('id') id: string): Promise<{ message: string }> {
    return this.roomsService.DeleteRoom(id);
  }
}
