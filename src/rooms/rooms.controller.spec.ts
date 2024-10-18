import { Test, TestingModule } from '@nestjs/testing';
import { RoomsService } from './rooms.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Rooms } from 'src/rooms/entities/room.entity';
describe('RoomsService', () => {
  let service: RoomsService;
  let repository: Repository<Rooms>;

  const mockRoomRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue({
      andWhere: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockReturnValue([[{}, {}], 2]),
    }),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomsService,
        {
          provide: getRepositoryToken(Rooms),
          useValue: mockRoomRepository,
        },
      ],
    }).compile();

    service = module.get<RoomsService>(RoomsService);
    repository = module.get<Repository<Rooms>>(getRepositoryToken(Rooms));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Create Room Test
  describe('create', () => {
    it('should create a room successfully', async () => {
      mockRoomRepository.save.mockResolvedValueOnce({});
      const result = await service.create({ roomNumber: '101',
        name: 'Sala de conferencias',
        area: 100,
        capacity: 50,
        observations: 'Una sala grande con proyector para dar conferencias',
        image: ['URL de la imagen de la sala'],
        location: 'Biblioteca publica municipal de Nicoya', });
      expect(result).toEqual({ message: 'Se creó la sala correctamente' });
      expect(mockRoomRepository.save).toHaveBeenCalledWith({ name: 'Room1' });
    });

    it('should handle errors while creating room', async () => {
      mockRoomRepository.save.mockRejectedValueOnce(new Error('Test Error'));
      await expect(service.create({  roomNumber: '101',
        name: 'Sala de conferencias',
        area: 100,
        capacity: 50,
        observations: 'Una sala grande con proyector para dar conferencias',
        image: ['URL de la imagen de la sala'],
        location: 'Biblioteca publica municipal de Nicoya', })).rejects.toThrow(
        new InternalServerErrorException('Test Error'),
      );
    });
  });

  // Find All Rooms Test with filters
  describe('findAllRooms', () => {
    it('should return paginated rooms with count', async () => {
      const filter = { page: 1, limit: 2 };
      const result = await service.findAllRooms(filter);
      expect(result).toEqual({ data: [{}, {}], count: 2 });
      expect(mockRoomRepository.createQueryBuilder).toHaveBeenCalled();
    });

    it('should apply filters in the query', async () => {
      const filter = { name: 'Room1', roomNumber: '101', status: 'D' };
      const query = mockRoomRepository.createQueryBuilder();

      await service.findAllRooms(filter);
      expect(query.andWhere).toHaveBeenCalledWith('room.name LIKE  :name', { name: '%Room1%' });
      expect(query.andWhere).toHaveBeenCalledWith('room.roomNumber LIKE  :roomNumber', { roomNumber: '%101%' });
      expect(query.andWhere).toHaveBeenCalledWith('room.status = :status', { status: 'D' });
    });
  });

  // Find One Room by ID
  describe('findOne', () => {
    it('should find a room by ID', async () => {
      const room = { roomId: 1, name: 'Room1' };
      mockRoomRepository.findOne.mockResolvedValueOnce(room);
      const result = await service.findOne(1);
      expect(result).toEqual(room);
      expect(mockRoomRepository.findOne).toHaveBeenCalledWith({ where: { roomId: 1 } });
    });

    it('should return null if no room is found', async () => {
      mockRoomRepository.findOne.mockResolvedValueOnce(null);
      const result = await service.findOne(1);
      expect(result).toBeNull();
    });
  });

  // Update Room Test
  describe('update', () => {
    it('should update a room', async () => {
      const updateRoomDto = { name: 'Updated Room' };
      mockRoomRepository.findOne.mockResolvedValueOnce({ roomId: 1 });
      const result = await service.update(1, updateRoomDto);
      expect(result).toEqual({ message: 'Se actualizó la sala correctamente' });
      expect(mockRoomRepository.update).toHaveBeenCalledWith(1, updateRoomDto);
    });

    it('should throw NotFoundException if room does not exist', async () => {
      mockRoomRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.update(1, { name: 'New Room' })).rejects.toThrow(
        new NotFoundException('No se encontró la sala.'),
      );
    });
  });

  // Update Room Status to Maintenance
  describe('updateStatusMaintenance', () => {
    it('should update room status to maintenance', async () => {
      const room = { roomId: 1, status: 'D' };
      mockRoomRepository.findOne.mockResolvedValueOnce(room);
      const result = await service.updateStatusMaintenance(1);
      expect(result).toEqual({
        message: 'Se actualizó el estado de la sala a en mantenimiento correctamente',
      });
      expect(mockRoomRepository.update).toHaveBeenCalledWith(1, { status: 'M' });
    });

    it('should throw NotFoundException if room is not found', async () => {
      mockRoomRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.updateStatusMaintenance(1)).rejects.toThrow(
        new NotFoundException('No se encontró la sala.'),
      );
    });
  });

  // Update Room Status to Closed
  describe('updateStatusClosed', () => {
    it('should update room status to closed', async () => {
      const room = { roomId: 1, status: 'D' };
      mockRoomRepository.findOne.mockResolvedValueOnce(room);
      const result = await service.updateStatusClosed(1);
      expect(result).toEqual({
        message: 'Se actualizó el estado de la sala a clausurada correctamente',
      });
      expect(mockRoomRepository.update).toHaveBeenCalledWith(1, { status: 'C' });
    });

    it('should throw NotFoundException if room is not found', async () => {
      mockRoomRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.updateStatusClosed(1)).rejects.toThrow(
        new NotFoundException('No se encontró la sala.'),
      );
    });
  });

  // Update Room Status to Available
  describe('updateStatusAvailable', () => {
    it('should update room status to available', async () => {
      const room = { roomId: 1, status: 'M' };
      mockRoomRepository.findOne.mockResolvedValueOnce(room);
      const result = await service.updateStatusAvailable(1);
      expect(result).toEqual({
        message: 'Se actualizó el estado de la sala a disponible correctamente',
      });
      expect(mockRoomRepository.update).toHaveBeenCalledWith(1, { status: 'D' });
    });

    it('should throw NotFoundException if room is not found', async () => {
      mockRoomRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.updateStatusAvailable(1)).rejects.toThrow(
        new NotFoundException('No se encontró la sala.'),
      );
    });
  });

  // Find All Available Rooms for Table
  describe('findAllRoomsTable', () => {
    it('should return all available rooms sorted by room number', async () => {
      const rooms = [
        { roomId: 1, name: 'Room A', roomNumber: '101' },
        { roomId: 2, name: 'Room B', roomNumber: '102' },
      ];
      mockRoomRepository.find.mockResolvedValueOnce(rooms);

      const result = await service.findAllRoomsTable();
      expect(result).toEqual(rooms);
      expect(mockRoomRepository.find).toHaveBeenCalledWith({
        select: ['roomId', 'name', 'roomNumber'],
        where: { status: 'D' },
      });
    });

    it('should return rooms sorted by roomNumber', async () => {
      const rooms = [
        { roomId: 1, name: 'Room A', roomNumber: '102' },
        { roomId: 2, name: 'Room B', roomNumber: '101' },
      ];
      mockRoomRepository.find.mockResolvedValueOnce(rooms);

      const result = await service.findAllRoomsTable();
      expect(result).toEqual([
        { roomId: 2, name: 'Room B', roomNumber: '101' },
        { roomId: 1, name: 'Room A', roomNumber: '102' },
      ]);
    });
  });
});
