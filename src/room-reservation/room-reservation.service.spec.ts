import { Test, TestingModule } from '@nestjs/testing';
import { RoomReservationService } from './room-reservation.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomReservation } from './entities/room-reservation.entity';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateRoomReservationDto } from './dto/create-room-reservation.dto';
import { FilterGetDTO } from './dto/FilterGetDTO';
import { ReservationDTO } from './dto/GetReservationsDTO';

describe('RoomReservationService', () => {
  let service: RoomReservationService;
  let repository: Repository<RoomReservation>;

  const mockRoomReservationRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockReturnValue([[{}, {}], 2]),
      getMany: jest.fn().mockReturnValue([{}]),
      getCount: jest.fn().mockReturnValue(1),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomReservationService,
        {
          provide: getRepositoryToken(RoomReservation),
          useValue: mockRoomReservationRepository,
        },
      ],
    }).compile();

    service = module.get<RoomReservationService>(RoomReservationService);
    repository = module.get<Repository<RoomReservation>>(getRepositoryToken(RoomReservation));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Test for create new reservation
  describe('NewReservation', () => {
    it('should create a new reservation successfully', async () => {
      const newReservationDto: CreateRoomReservationDto = {
        name: 'Instituto Tecnológico',
        date: new Date(),
        selectedHours: [9, 10, 11],
        observations: 'Reunión importante',
        EventId: 1,
        courseId: 2,
        userCedula: '1234567890',
        roomId: 3,
        reservationDate: new Date(),
      };

      const result = await service.NewReservation(newReservationDto);
      expect(result).toEqual({ message: 'La solicitud se genero correctamente' });
      expect(mockRoomReservationRepository.save).toHaveBeenCalled();
    });

    it('should throw an error if reservation creation fails', async () => {
      const newReservationDto = {
        name: 'Instituto Tecnológico',
        date: new Date(),
        selectedHours: [9, 10, 11],
        observations: 'Reunión importante',
        EventId: 1,
        courseId: 2,
        userCedula: '1234567890',
        roomId: 3,
        reservationDate: new Date(),
      };
      mockRoomReservationRepository.save.mockRejectedValueOnce(new Error('Error creating reservation'));

      await expect(service.NewReservation(newReservationDto)).rejects.toThrow(
        new InternalServerErrorException('Error creating reservation'),
      );
    });
  });

  // Test for finalizeReservation
  describe('finalizeReservation', () => {
    it('should finalize a reservation successfully', async () => {
      const updateDto = { finishObservation: 'Finalizado correctamente' };
      const reservation = { rommReservationId: 1, reserveStatus: 'Pending' };

      mockRoomReservationRepository.findOne.mockResolvedValueOnce(reservation);
      mockRoomReservationRepository.save.mockResolvedValueOnce(reservation);

      const result = await service.finalizeReservation(1, updateDto);
      expect(result).toEqual({ message: 'La solicitud se genero correctamente' });
      expect(mockRoomReservationRepository.findOne).toHaveBeenCalledWith({
        where: { rommReservationId: 1 },
      });
    });

    it('should throw NotFoundException if reservation is not found', async () => {
      mockRoomReservationRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.finalizeReservation(1, { finishObservation: 'Finalizado' })).rejects.toThrow(
        new NotFoundException('No se encontró la reservacion.'),
      );
    });
  });

  // Test for getAllReservations
  describe('getAllReservations', () => {
    it('should return paginated list of reservations with filters', async () => {
      const filterDto: FilterGetDTO = {
        page: 1,
        limit: 5,
        date: new Date('2024-10-17'),
        name: 'Instituto Tecnológico',
        roomId: 3,
        reserveStatus: 'Pendiente',
        userCedula: '1234567890',
      };

      // Mocking repository query results
      const reservations = [{}, {}];
      mockRoomReservationRepository.createQueryBuilder().getManyAndCount.mockReturnValueOnce([reservations, 2]);

      const result = await service.getAllReservations(filterDto);

      expect(result).toEqual({ data: reservations, count: 2 });
      expect(mockRoomReservationRepository.createQueryBuilder).toHaveBeenCalled();
      expect(mockRoomReservationRepository.createQueryBuilder().andWhere).toHaveBeenCalledWith(
        'room_reservations.reserveStatus = :status',
        { status: 'Pendiente' }
      );
      expect(mockRoomReservationRepository.createQueryBuilder().andWhere).toHaveBeenCalledWith(
        'room_reservations.roomId = :roomId',
        { roomId: 3 }
      );
      expect(mockRoomReservationRepository.createQueryBuilder().andWhere).toHaveBeenCalledWith(
        'room_reservations.date = :date',
        { date: new Date('2024-10-17') }
      );
    });


  // Test for refuseReservation
  describe('refuseReservation', () => {
    it('should refuse a reservation successfully', async () => {
      const reservation = { rommReservationId: 1, reserveStatus: 'Pending' };
      mockRoomReservationRepository.findOne.mockResolvedValueOnce(reservation);

      const result = await service.refuseReservation(1);
      expect(result).toEqual({ message: 'La solicitud se genero correctamente' });
      expect(mockRoomReservationRepository.save).toHaveBeenCalledWith({
        ...reservation,
        reserveStatus: 'Finalizado',
        finishObservation: 'Rechazado por el administrador',
      });
    });

    it('should throw NotFoundException if reservation is not found', async () => {
      mockRoomReservationRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.refuseReservation(1)).rejects.toThrow(
        new NotFoundException('No se encontró la reservacion.'),
      );
    });
  });

  // Test for countReservationsByCedula
  describe('countReservationsByCedula', () => {
    it('should return count of active reservations by user cedula', async () => {
      const result = await service.countReservationsByCedula('1234567890');
      expect(result).toBe(1);
      expect(mockRoomReservationRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });

});
});
