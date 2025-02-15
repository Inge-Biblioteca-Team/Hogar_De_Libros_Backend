import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { Repository } from 'typeorm';
import { events } from './events.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AdvicesService } from 'src/advices/advices.service';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateEventsDTO } from './DTO/create-events.dto';
import { UpdateEventsDTO } from './DTO/update-events.dto';

const mockEventRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
    execute: jest.fn(),
  }),
};

const mockAdviceService = {
  createNewAdvice: jest.fn(),
};

describe('EventsService', () => {
  let service: EventsService;
  let eventRepository: Repository<events>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        { provide: getRepositoryToken(events), useValue: mockEventRepository },
        { provide: AdvicesService, useValue: mockAdviceService },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    eventRepository = module.get<Repository<events>>(getRepositoryToken(events));
  });

  describe('createEvent', () => {
    it('should create an event successfully', async () => {
      const dto: CreateEventsDTO = {
        Location: 'Parque recadero Briceño',
        Title: 'Test Event',
        Details: 'Test Details',
        Category: 'Charla',
        Date: new Date(),
        Time: '10:00:00',
        Image: 'test.jpg',
        TargetAudience: 'Niños de 5 a 10 años',
        InchargePerson: 'Juan Perez',
        programProgramsId: 1,
      };

      const savedEvent = { ...dto, EventId: 1 };
      mockEventRepository.create.mockReturnValue(savedEvent);
      mockEventRepository.save.mockResolvedValue(savedEvent);
      mockAdviceService.createNewAdvice.mockResolvedValue(undefined);

      const result = await service.createEvent(dto);
      expect(result).toEqual({ message: 'Se creó el evento con id: 1 correctamente' });
    });

    it('should throw an InternalServerErrorException on failure', async () => {
      mockEventRepository.save.mockRejectedValue(new Error('Error'));

      await expect(service.createEvent({  Location: 'Parque recadero Briceño',
        Title: 'Test Event',
        Details: 'Test Details',
        Category: 'Charla',
        Date: new Date(),
        Time: '10:00:00',
        Image: 'test.jpg',
        TargetAudience: 'Niños de 5 a 10 años',
        InchargePerson: 'Juan Perez',
        programProgramsId: 1, }))
        .rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('updateEvent', () => {
    it('should update an event successfully', async () => {
      const dto: UpdateEventsDTO = { EventId: 1, Title: 'Updated Event', Status: 'Active' };
      mockEventRepository.findOne.mockResolvedValue(dto);
      mockEventRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.updateEvent(dto);
      expect(result).toEqual({ message: 'Se actualizó el evento correctamente' });
    });

    it('should return a message if event not found', async () => {
      mockEventRepository.findOne.mockResolvedValue(null);
      const result = await service.updateEvent({ EventId: 1, Title: 'Updated Event', Status: 'Active' });
      expect(result).toEqual({ message: 'No se encontró el evento' });
    });
  });

  describe('cancelEvent', () => {
    it('should cancel an event successfully', async () => {
      mockEventRepository.findOne.mockResolvedValue({ EventId: 1 });
      mockEventRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.cancelEvent(1);
      expect(result).toEqual({ message: 'Se cancelo el evento exitosamente' });
    });

    it('should throw NotFoundException if event does not exist', async () => {
      mockEventRepository.findOne.mockResolvedValue(null);
      await expect(service.cancelEvent(1)).rejects.toThrow(InternalServerErrorException);
    });
  });
});
