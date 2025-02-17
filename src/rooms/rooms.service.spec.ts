import { Test, TestingModule } from '@nestjs/testing';
import { RoomsService } from './rooms.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rooms } from './entities/room.entity';
import { getRoomDto } from './dto/get-pagination.dto';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';


describe('RoomsService', () => {
  let service: RoomsService;
  let repository: Repository<Rooms>;

  const mockRoomRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(), 
    createQueryBuilder: jest.fn().mockReturnValue({
      andWhere: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockReturnValue([[{}, {}], 2]),
    }),
    
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
  repository = module.get(getRepositoryToken(Rooms));
});

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('create', () => {
    it('should create a room successfully', async () => {
      const createRoomDto = {
        roomNumber: '101',
        name: 'Sala de conferencias',
        area: 100,
        capacity: 50,
        location: 'Biblioteca',
      };
  
      // Simula que `create` y `save` funcionan correctamente
      mockRoomRepository.create.mockReturnValue(createRoomDto);
      mockRoomRepository.save.mockResolvedValue(createRoomDto);
  
      const result = await service.create(createRoomDto);
  
      expect(result).toEqual({ message: 'Se creó la sala correctamente' });
      expect(mockRoomRepository.save).toHaveBeenCalledWith(createRoomDto);
    });
  
    it('should throw an error if room creation fails', async () => {
      const createRoomDto = {
        roomNumber: '102',
        name: 'Sala de juntas',
        area: 50,
        capacity: 20,
        location: 'Edificio A',
      };
  
      // Simula un error al guardar la sala
      mockRoomRepository.create.mockReturnValue(createRoomDto); // Asegura que create devuelve el DTO correctamente
      mockRoomRepository.save.mockRejectedValue(new Error('Error al procesar la solicitud'));
  
      // Verifica que el error sea lanzado
      await expect(service.create(createRoomDto)).rejects.toThrow(
        new InternalServerErrorException('Error al procesar la solicitud')
      );
    });
  });
  describe('findAllRooms', () => {
    it('should return paginated list of rooms', async () => {
      const filter = { page: 1, limit: 2 };
      const rooms = [{}, {}];
      mockRoomRepository.createQueryBuilder().getManyAndCount.mockReturnValueOnce([rooms, 2]);

      const result = await service.findAllRooms(filter);
      expect(result).toEqual({ data: rooms, count: 2 });
    });
  });


  describe('findOne', () => {
    it('should return a room by ID', async () => {
      const room = { roomId: 1, name: 'Room 101' };
      mockRoomRepository.findOne.mockResolvedValueOnce(room);

      const result = await service.findOne(1);
      expect(result).toEqual(room);
      expect(mockRoomRepository.findOne).toHaveBeenCalledWith({ where: { roomId: 1 } });
    });

    it('should return null if room is not found', async () => {
      mockRoomRepository.findOne.mockResolvedValueOnce(null);
      const result = await service.findOne(1);
      expect(result).toBeNull();
    });
  });

 
  describe('update', () => {
    it('should update a room successfully', async () => {
      const updateRoomDto = { name: 'Updated Room' };
      const room = { roomId: 1, name: 'Room 101' };

      mockRoomRepository.findOne.mockResolvedValueOnce(room);
      mockRoomRepository.update.mockResolvedValueOnce(undefined);

      const result = await service.update(1, updateRoomDto);
      expect(result).toEqual({ message: 'Se actualizó la sala correctamente' });
      expect(mockRoomRepository.update).toHaveBeenCalledWith(1, updateRoomDto);
    });

    it('should throw NotFoundException if room is not found', async () => {
      mockRoomRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.update(1, { name: 'New Room' })).rejects.toThrow(
        new NotFoundException('No se encontró la sala.'),
      );
    });
  });


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
  });
});
