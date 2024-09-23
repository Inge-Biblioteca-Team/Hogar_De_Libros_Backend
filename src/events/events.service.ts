import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { events } from './events.entity';
import { Repository } from 'typeorm';
import { CreateEventsDTO } from './DTO/create-events.dto';
import { PaginationEventsDTO } from './DTO/pagination-events.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(events) private EventsRepository: Repository<events>,
  ) {}

  async createEvent(createEventsDTO: CreateEventsDTO): Promise<events> {
    return await this.EventsRepository.save(createEventsDTO);
  }

  async getAllEvents(
    @Body() paginationEventsDTO: PaginationEventsDTO,
  ): Promise<{ data: events[]; count: number }> {
    const { Page = 1, Limit = 10 } = paginationEventsDTO;

    const query = this.EventsRepository.createQueryBuilder('events');
    query.skip((Page - 1) * Limit).take(Limit);
    const [data, count] = await query.getManyAndCount();
    return { data, count };
  }
}
