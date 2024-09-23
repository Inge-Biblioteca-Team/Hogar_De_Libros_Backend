import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventsDTO } from './DTO/create-events.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationEventsDTO } from './DTO/pagination-events.dto';
import { events } from './events.entity';
import { UpdateEventsDTO } from './DTO/update-events.dto';
import { FileInterceptor } from '@nestjs/platform-express';
@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiResponse({ status: 201, description: 'Evento creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Error al crear el evento' })
  @ApiResponse({
    status: 500,
    description: 'Un error a ocurrido en el servidor',
  })
  createEvent(
    @Body() createEventsDTO: CreateEventsDTO,
    @UploadedFile() file,
  ): Promise<{ message: string; eventId?: number }> {
    if (file) {
      const filePath = `http://localhost:3000/assets/${file.filename}`;
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

  @Put()
  @UseInterceptors(FileInterceptor('image'))
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
    @Query('id') id: number, @UploadedFile() file
  ): Promise<{ message: string }> {
    if (file) {
        const filePath = `http://localhost:3000/assets/${file.filename}`;
        updateEvetsDTO.Image = filePath;
      }
    return this.eventsService.updateEvent(updateEvetsDTO, id);
  }

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
}
