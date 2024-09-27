/* eslint-disable prettier/prettier */
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
import { SeachDTO } from './DTO/SeachDTO';
import { NexEventsDTO } from './DTO/NextEvents';

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
      category,
      TargetAudience,
      StartDate,
      EndDate,
    } = paginationEventsDTO;

    const query = this.EventsRepository.createQueryBuilder('events');

    if (Status) {
      query.andWhere('events.Status = :Status', { Status });
    }
    if (Title) {
      const normalizedTitle = Title.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, ''); // Elimina las tildes

      query.andWhere(
        `LOWER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(events.Title, 'á', 'a'), 'é', 'e'), 'í', 'i'), 'ó', 'o'), 'ú', 'u')) LIKE LOWER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(:Title, 'á', 'a'), 'é', 'e'), 'í', 'i'), 'ó', 'o'), 'ú', 'u'))`,
        { Title: `%${normalizedTitle}%` },
      );
    }

    if (category) {
      query.andWhere('events.Category Like :category', {
        category: `%${category}%`,
      });
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

    query.orderBy('events.Date', 'DESC').addOrderBy('events.Time', 'ASC');
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

  async updatePendientStatus(id: number) {
    try {
      const findEvent = await this.EventsRepository.findOne({
        where: { EventId: id },
      });
      if (!findEvent) {
        return { message: 'No se encontró el evento' };
      }
      await this.EventsRepository.update(id, { Status: 'P' });
      return { message: 'Se cambió el estado a finalizado exitosamente' };
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        return { message: 'Error en el servidor, no se pudo crear el evento' };
      }
      return { message: 'Hubo un error al actualizar el estado del evento' };
    }
  }

  async getNextEventsSchedule(
    searchDTO: SeachDTO,
  ): Promise<{ data: NexEventsDTO[]; count: number }> {
    const { month, category } = searchDTO;

    const query = this.EventsRepository.createQueryBuilder('events');

    let data: events[];
    let count: number;

    const currentDate = new Date();
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(currentDate.getMonth() + 3);

    try {
      query
        .where('events.Date > :currentDate', { currentDate })
        .andWhere('events.Date <= :threeMonthsLater', { threeMonthsLater });

      if (month) {
        query.andWhere('MONTH(events.Date) = :month', { month });
      }

      if (category) {
        query.andWhere('events.Category Like :category', {
          category: `%${category}%`,
        });
      }

      query.orderBy('events.Date', 'ASC');

      [data, count] = await query.getManyAndCount();
    } catch (error) {
      throw new InternalServerErrorException('Error Al cargar los cursos');
    }

    const result = await Promise.all(
      data.map(async (event) => {
        return {
          id: event.EventId,
          eventType: event.Category,
          image: event.Image,
          instructor: event.InchargePerson,
          location: event.Location,
          date: event.Date,
          eventTime: event.Time,
          objetiveAge: event.TargetAudience,
          status: event.Status,
          details: event.Details,
          title: event.Title,
        };
      }),
    );

    return { data: result, count };
  }
}
