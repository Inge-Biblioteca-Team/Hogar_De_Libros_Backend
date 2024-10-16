import { Test, TestingModule } from '@nestjs/testing';
import { RoomsService } from './rooms.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Rooms } from './entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { getRoomDto } from './dto/get-pagination.dto';

describe('RoomsService', () => {
  let service: RoomsService;
  let repository: Repository<Rooms>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomsService,
        {
          provide: getRepositoryToken(Rooms),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<RoomsService>(RoomsService);
    repository = module.get<Repository<Rooms>>(getRepositoryToken(Rooms));
  });

  describe('create', () => {
    it('should create and return a success message', async () => {
      const dto: CreateRoomDto = { roomNumber: '1',
        name: 'Sala de conferencias',
        area: 100,
        capacity: 50,
        observations: 'Una sala grande con proyector para dar conferencias',
        image: ['URL de la imagen de la sala'],
        location: 'Biblioteca publica municipal de Nicoya', };
      jest.spyOn(repository, 'save').mockResolvedValue(dto as any);

      const result = await service.create(dto);
      expect(result).toEqual({ message: 'Se creó la sala correctamente' });
    });

    it('should throw InternalServerErrorException if save fails', async () => {
      const dto: CreateRoomDto = { roomNumber: '1',
        name: 'Sala de conferencias',
        area: 100,
        capacity: 50,
        observations: 'Una sala grande con proyector para dar conferencias',
        image: ['URL de la imagen de la sala'],
        location: 'Biblioteca publica municipal de Nicoya', };
      jest.spyOn(repository, 'save').mockRejectedValue(new Error());

      await expect(service.create(dto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findAllRooms', () => {
    it('should return paginated rooms with count', async () => {
      const dto: getRoomDto = { page: 1, limit: 2, name: 'Room A' };
      const rooms = [{ roomId: 1, name: 'Room A', roomNumber: '101', status: 'D' }];
      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([rooms, 1]),
      } as any);

      const result = await service.findAllRooms(dto);
      expect(result).toEqual({ data: rooms, count: 1 });
    });
  });

  describe('findOne', () => {
    it('should return a room by ID', async () => {
      const room = { roomId: 1, name: 'Room A', roomNumber: '101', status: 'D' };
      jest.spyOn(repository, 'findOne').mockResolvedValue(room as any);

      const result = await service.findOne(1);
      expect(result).toEqual(room);
    });

    it('should throw NotFoundException if room is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1)).resolves.toBeNull();
    });
  });

  describe('update', () => {
    it('should update and return success message', async () => {
      const updateDto: UpdateRoomDto = { roomNumber: '1',
        name: 'Sala de conferencias',
        area: 100,
        capacity: 50,
        observations: 'Una sala grande con proyector para dar conferencias',
        image: ['URL de la imagen de la sala'],
        location: 'Biblioteca publica municipal de Nicoya', };
      jest.spyOn(repository, 'findOne').mockResolvedValue({ roomId: 1 } as any);
      jest.spyOn(repository, 'update').mockResolvedValue(undefined);

      const result = await service.update(1, updateDto);
      expect(result).toEqual({ message: 'Se actualizó la sala correctamente' });
    });

    it('should throw NotFoundException if room not found for update', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.update(1, {} as UpdateRoomDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatusMaintenance', () => {
    it('should update the room status to "M" and return success message', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue({ roomId: 1 } as any);
      jest.spyOn(repository, 'update').mockResolvedValue(undefined);

      const result = await service.updateStatusMaintenance(1);
      expect(result).toEqual({
        message: 'Se actualizó el estado de la sala a en mantenimiento correctamente',
      });
    });

    it('should throw NotFoundException if room not found for maintenance update', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.updateStatusMaintenance(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatusClosed', () => {
    it('should update the room status to "C" and return success message', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue({ roomId: 1 } as any);
      jest.spyOn(repository, 'update').mockResolvedValue(undefined);

      const result = await service.updateStatusClosed(1);
      expect(result).toEqual({
        message: 'Se actualizó el estado de la sala a clausurada correctamente',
      });
    });

    it('should throw NotFoundException if room not found for closed status update', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.updateStatusClosed(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatusAvailable', () => {
    it('should update the room status to "D" and return success message', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue({ roomId: 1 } as any);
      jest.spyOn(repository, 'update').mockResolvedValue(undefined);

      const result = await service.updateStatusAvailable(1);
      expect(result).toEqual({
        message: 'Se actualizó el estado de la sala a disponible correctamente',
      });
    });

    it('should throw NotFoundException if room not found for available status update', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.updateStatusAvailable(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllRoomsTable', () => {
    it('should return all rooms sorted by room number', async () => {
      const rooms = [
        { roomId: 1, name: 'Room B', roomNumber: '102', status: 'D' },
        { roomId: 2, name: 'Room A', roomNumber: '101', status: 'D' },
      ];
      jest.spyOn(repository, 'find').mockResolvedValue(rooms as any);

      const result = await service.findAllRoomsTable();
      expect(result).toEqual([
        { roomId: 2, name: 'Room A', roomNumber: '101' },
        { roomId: 1, name: 'Room B', roomNumber: '102' },
      ]);
    });
  });
});
