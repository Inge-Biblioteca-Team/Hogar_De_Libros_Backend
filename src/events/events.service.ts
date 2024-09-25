import {
  BadRequestException,
  Body,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { events } from './events.entity';
import { Repository } from 'typeorm';
import { CreateEventsDTO } from './DTO/create-events.dto';
import { PaginationEventsDTO } from './DTO/pagination-events.dto';
import { UpdateEventsDTO } from './DTO/update-events.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(events) private EventsRepository: Repository<events>,
  ) {}

  async createEvent(
    createEventsDTO: CreateEventsDTO,
  ): Promise<{ message: string; eventId?: number }> {
    try {
      const event = await this.EventsRepository.save(createEventsDTO);
      return {
        message:
          'Se creó el evento con id: ' + event.EventId + ' correctamente',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        return { message: 'Error en la petición del evento, no se pudo crear' };
      }
      if (error instanceof InternalServerErrorException) {
        return { message: 'Error en el servidor, no se pudo crear el evento' };
      }
      return { message: 'Hubo un error al crear el evento' };
    }
  }

  async getAllEvents(
    @Body() paginationEventsDTO: PaginationEventsDTO,
  ): Promise<{ data: events[]; count: number }> {
    const {
      Page = 1,
      Limit = 10,
      Status,
      Title,
      TargetAudience,
      StartDate,
      EndDate,
    } = paginationEventsDTO;

    const query = this.EventsRepository.createQueryBuilder('events');

    if (Status) {
      query.andWhere('events.Status = :Status', { Status });
    }
    if (Title) {
      query.andWhere('events.Title = :Title', { Title });
    }
    if (TargetAudience) {
      query.andWhere('events.TargetAudience = :TargetAudience', {
        TargetAudience,
      });
    }
    if (StartDate) {
      query.andWhere('events.Date >= :StartDate', { StartDate });
    }
    if (EndDate) {
      query.andWhere('events.Date <= :EndDate', { EndDate });
    }

    query.orderBy('events.Date', 'ASC').addOrderBy('events.Time', 'ASC');
    query.skip((Page - 1) * Limit).take(Limit);
    const [data, count] = await query.getManyAndCount();
    return { data, count };
  }

  async updateEvent(
    updateEvetsDTO: UpdateEventsDTO,
    id: number,
  ): Promise<{ message: string }> {
    try {
      const findEvent = await this.EventsRepository.findOne({
        where: { EventId: id },
      });
      if (!findEvent) {
        return { message: 'No se encontró el evento' };
      }
      await this.EventsRepository.update(id, updateEvetsDTO);
      return { message: 'Se actualizó el evento correctamente' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        return { message: 'Error en la petición del evento, no se pudo crear' };
      }
      if (error instanceof InternalServerErrorException) {
        return { message: 'Error en el servidor, no se pudo crear el evento' };
      }
      return { message: 'Hubo un error al actualizar el evento' };
    }
  }

  async updateEjecutionStatus(id: number) {
    try {
      const findEvent = await this.EventsRepository.findOne({
        where: { EventId: id },
      });
      if (!findEvent) {
        return { message: 'No se encontró el evento' };
      }
      await this.EventsRepository.update(id, { Status: 'E' });
      return { message: 'Se cambió el estado a en ejecución exitosamente' };
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        return { message: 'Error en el servidor, no se pudo crear el evento' };
      }
      return { message: 'Hubo un error al actualizar el estado del evento' };
    }
  }

  async updateFinalizedStatus(id: number) {
    try {
      const findEvent = await this.EventsRepository.findOne({
        where: { EventId: id },
      });
      if (!findEvent) {
        return { message: 'No se encontró el evento' };
      }
      await this.EventsRepository.update(id, { Status: 'F' });
      return { message: 'Se cambió el estado a finalizado exitosamente' };
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        return { message: 'Error en el servidor, no se pudo crear el evento' };
      }
      return { message: 'Hubo un error al actualizar el estado del evento' };
    }
  }
}
