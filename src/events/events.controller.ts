import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventsDTO } from './DTO/create-events.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationEventsDTO } from './DTO/pagination-events.dto';
import { events } from './events.entity';
@ApiTags('events')
@Controller('events')
export class EventsController {
    constructor(private eventsService : EventsService) {}


    @Post()
    @ApiResponse({ status: 201, description: 'Evento creado exitosamente' })
    @ApiResponse({ status: 400, description: 'Error al crear el evento' })
    createEvent(@Body() createEventsDTO: CreateEventsDTO){
        return this.eventsService.createEvent(createEventsDTO);
    }

    @Get()
    @ApiResponse({ status: 200, description: 'Lista de eventos mostrada' })
    @ApiResponse({ status: 400, description: 'Parametros invalidos' })
    @ApiResponse({ status: 500, description: 'Un error a ocurrido al mostrar la lista de eventos' })
    getAllEvents(@Query() paginationEventsDTO: PaginationEventsDTO){
        return this.eventsService.getAllEvents(paginationEventsDTO);
    }
}
