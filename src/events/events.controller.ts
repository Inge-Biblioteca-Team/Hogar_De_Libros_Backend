/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventsDTO } from './DTO/create-events.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationEventsDTO } from './DTO/pagination-events.dto';
import { UpdateEventsDTO } from './DTO/update-events.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { SeachDTO } from './DTO/SeachDTO';
import { NexEventsDTO } from './DTO/NextEvents';
@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: '../assets/events',
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  @ApiResponse({ status: 201, description: 'Evento creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Error al crear el evento' })
  @ApiResponse({
    status: 500,
    description: 'Un error a ocurrido en el servidor',
  })
  async createEvent(
    @Body() createEventsDTO: CreateEventsDTO,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ message: string; eventId?: number }> {
    if (file) {
      const baseUrl = 'http://localhost:3000';
      const filePath = `${baseUrl}/assets/events/${file.filename}`;
      createEventsDTO.Image = filePath;
    }
    return this.eventsService.createEvent(createEventsDTO);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Lista de eventos mostrada' })
  @ApiResponse({ status: 400, description: 'Parametros invalidos' })
  @ApiResponse({
    status: 500,
    description: 'Un error a ocurrido al mostrar la lista de eventos',
  })
  getAllEvents(@Query() paginationEventsDTO: PaginationEventsDTO) {
    return this.eventsService.getAllEvents(paginationEventsDTO);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'creator')
  @Put()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: '../assets/events',
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  @ApiResponse({
    status: 200,
    description: 'Actualización del evento se a realizado correctamente',
  })
  @ApiResponse({ status: 400, description: 'Ocurrió un problema' })
  @ApiResponse({
    status: 500,
    description: 'Un error a ocurrido en el servidor',
  })
  updateEvent(
    @Body() updateEvetsDTO: UpdateEventsDTO,
    @Query('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ message: string }> {
    if (file) {
      const baseUrl = 'http://localhost:3000';
      const filePath = `${baseUrl}/assets/events/${file.filename}`;
      updateEvetsDTO.Image = filePath;
    }
    return this.eventsService.updateEvent(updateEvetsDTO, id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'creator')
  @Patch('ejecution-status')
  @ApiResponse({
    status: 200,
    description: 'Se cambio el estado a en ejecucion',
  })
  @ApiResponse({
    status: 500,
    description: 'Un error a ocurrido en el servidor',
  })
  updateEjecutionStatus(@Query('id') id: number) {
    return this.eventsService.updateEjecutionStatus(id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'creator')
  @Patch('finalized-status')
  @ApiResponse({
    status: 200,
    description: 'Se cambio el estado a en ejecucion',
  })
  @ApiResponse({
    status: 500,
    description: 'Un error a ocurrido en el servidor',
  })
  updateFinalizedStatus(@Query('id') id: number) {
    return this.eventsService.updateFinalizedStatus(id);
  }

  @Patch('CancelEvent')
  updatePendientStatus(@Query('id') id: number): Promise<{ message: string }> {
    return this.eventsService.cancelEvent(id);
  }

  @Get('NextEvents')
  getNextEvents(
    @Query() SearchParams: SeachDTO,
  ): Promise<{ data: NexEventsDTO[]; count: number }> {
    return this.eventsService.getNextEventsSchedule(SearchParams);
  }

  @Get('EventList')
  async EventList(): Promise< CreateEventsDTO[] > {
    return this.eventsService.EventList();
  }
}
