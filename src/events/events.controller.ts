/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventsDTO } from './DTO/create-events.dto';
import { ApiTags } from '@nestjs/swagger';
import { PaginationEventsDTO } from './DTO/pagination-events.dto';
import { UpdateEventsDTO } from './DTO/update-events.dto';
import { SeachDTO } from './DTO/SeachDTO';
import { NexEventsDTO } from './DTO/NextEvents';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'asistente')
  async createEvent(
    @Body() createEventsDTO: CreateEventsDTO,
  ): Promise<{ message: string }> {
    return this.eventsService.createEvent(createEventsDTO);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'asistente')
  getAllEvents(@Query() paginationEventsDTO: PaginationEventsDTO) {
    return this.eventsService.getAllEvents(paginationEventsDTO);
  }

  @Put()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  updateEvent(
    @Body() updateEvetsDTO: UpdateEventsDTO
  ): Promise<{ message: string }> {
    return this.eventsService.updateEvent(updateEvetsDTO);
  }

  @Patch('Cancel/:id')
  @Roles('admin')
  updatePendientStatus(@Param('id') id: number): Promise<{ message: string }> {
    return this.eventsService.cancelEvent(id);
  }

  @Get('NextEvents')
  getNextEvents(
    @Query() SearchParams: SeachDTO,
  ): Promise<{ data: NexEventsDTO[]; count: number }> {
    return this.eventsService.getNextEventsSchedule(SearchParams);
  }

  @Get('EventList')
  async EventList(@Query('date') date: Date): Promise<CreateEventsDTO[]> {
    return this.eventsService.EventList(date);
  }
}
