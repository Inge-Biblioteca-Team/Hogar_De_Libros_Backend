import { Test, TestingModule } from '@nestjs/testing';
import { RoomReservationService } from './room-reservation.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RoomReservation } from './entities/room-reservation.entity';
import { NotesService } from 'src/notes/notes.service';
import { CreateRoomReservationDto } from './dto/create-room-reservation.dto';
import { NotFoundException } from '@nestjs/common';

describe('RoomReservationService', () => {
  let service: RoomReservationService;
  let repository: Repository<RoomReservation>;
  let notesService: NotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomReservationService,
        {
          provide: getRepositoryToken(RoomReservation),
          useClass: Repository,
        },
        {
          provide: NotesService,
          useValue: {
            createNote: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RoomReservationService>(RoomReservationService);
    repository = module.get<Repository<RoomReservation>>(
      getRepositoryToken(RoomReservation),
    );
    notesService = module.get<NotesService>(NotesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('NewReservation', () => {
    it('should create a new reservation and return success message', async () => {
      const newReservation: CreateRoomReservationDto = {
        name: 'John Doe',
        date: new Date('2024-02-23'),
        userCedula: '123456789',
        roomId: 1,
        EventId: 0,
        courseId: 0,
        reservationDate: new Date(),
        selectedHours: [12, 1],
        observations: 'Test reservation',
 
      };

      const saveSpy = jest.spyOn(repository, 'save').mockResolvedValue(null);
      const createSpy = jest
        .spyOn(repository, 'create')
        .mockReturnValue(newReservation as unknown as RoomReservation);
      const noteSpy = jest.spyOn(notesService, 'createNote').mockResolvedValue(null);

      const result = await service.NewReservation(newReservation);

      expect(createSpy).toHaveBeenCalledWith(expect.objectContaining(newReservation));
      expect(saveSpy).toHaveBeenCalled();
      expect(noteSpy).toHaveBeenCalled();
      expect(result).toEqual({ message: 'La solicitud se genero correctamente' });
    });
  });

  describe('finalizeReservation', () => {
    it('should finalize an existing reservation', async () => {
      const id = 1;
      const updateDto = { finishObservation: 'Meeting ended' };
      const existingReservation = { rommReservationId: id, reserveStatus: 'Pending' };

      jest.spyOn(repository, 'findOne').mockResolvedValue(existingReservation as RoomReservation);
      const saveSpy = jest.spyOn(repository, 'save').mockResolvedValue(null);

      const result = await service.finalizeReservation(id, updateDto);

      expect(saveSpy).toHaveBeenCalled();
      expect(result).toEqual({ message: 'La solicitud se genero correctamente' });
    });

    it('should throw NotFoundException if reservation does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.finalizeReservation(1, { finishObservation: 'Done' }))
        .rejects
        .toThrow('No se encontró la reservacion.');
    });
  });

  
});
