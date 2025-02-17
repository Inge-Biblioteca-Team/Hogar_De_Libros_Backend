/* eslint-disable prettier/prettier */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Rooms } from './entities/room.entity';
import { Repository } from 'typeorm';
import { getRoomDto } from './dto/get-pagination.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Rooms)
    private roomRepository: Repository<Rooms>,
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<{ message: string }> {
    try {
      const room = await this.roomRepository.findOneBy({
        roomNumber: createRoomDto.roomNumber,
      });

      if (room) {
        throw new NotFoundException({
          message: `Ya existe una sala con el numero de sala${createRoomDto.roomNumber}.`,
        });
      }

      const newRoom = this.roomRepository.create(createRoomDto)

      await this.roomRepository.save(newRoom);
      return {
        message: 'Se creó la sala correctamente',
      };
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async findAllRooms(
    filter: getRoomDto,
  ): Promise<{ data: CreateRoomDto[]; count: number }> {
    const { page = 1, limit = 10, name, roomNumber, status } = filter;
    const query = this.roomRepository.createQueryBuilder('room');
    if (name) {
      query.andWhere('room.name LIKE  :name', { name: `%${name}%` });
    }
    if (roomNumber) {
      query.andWhere('room.roomNumber LIKE  :roomNumber', {
        roomNumber: `%${roomNumber}%`,
      });
    }
    if (status) {
      query.andWhere('room.status = :status', { status });
    }
    query.skip((page - 1) * limit).take(limit);

    const [rooms, count] = await query.getManyAndCount();

    return { data: rooms, count };
  }

  findOne(id: number) {
    const room = this.roomRepository.findOne({ where: { roomId: id } });
    return room;
  }
  // PROMISE MESSAGE
  async update(
    id: number,
    updateRoomDto: UpdateRoomDto,
  ): Promise<{ message: string }> {
    try {
      const findroom = await this.roomRepository.findOne({
        where: { roomId: id },
      });
      if (!findroom) {
        throw new NotFoundException({
          message: 'No se encontró la sala.',
        });
      }
      await this.roomRepository.update(id, updateRoomDto);
      return {
        message: 'Se actualizó la sala correctamente',
      };
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async updateStatusMaintenance(id: number): Promise<{ message: string }> {
    try {
      const findroom = await this.roomRepository.findOne({
        where: { roomId: id },
      });
      if (!findroom) {
        throw new NotFoundException({
          message: 'No se encontró la sala.',
        });
      }
      await this.roomRepository.update(id, { status: 'M' });
      return {
        message:
          'Se actualizó el estado de la sala a en mantenimiento correctamente',
      };
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async updateStatusClosed(id: number): Promise<{ message: string }> {
    try {
      const findroom = await this.roomRepository.findOne({
        where: { roomId: id },
      });
      if (!findroom) {
        throw new NotFoundException({
          message: 'No se encontró la sala.',
        });
      }
      await this.roomRepository.update(id, { status: 'C' });
      return {
        message: 'Se actualizó el estado de la sala a clausurada correctamente',
      };
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async updateStatusAvailable(id: number): Promise<{ message: string }> {
    try {
      const findroom = await this.roomRepository.findOne({
        where: { roomId: id },
      });
      if (!findroom) {
        throw new NotFoundException({
          message: 'No se encontró la sala.',
        });
      }
      await this.roomRepository.update(id, { status: 'D' });
      return {
        message: 'Se actualizó el estado de la sala a disponible correctamente',
      };
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async findAllRoomsTable(): Promise<CreateRoomDto[]> {
    const rooms = await this.roomRepository.find({
      select: ['roomId', 'name', 'roomNumber'],
      where: { status: 'D' },
    });
    const sortedRooms = rooms.sort(
      (a, b) => parseInt(a.roomNumber) - parseInt(b.roomNumber),
    );

    return sortedRooms;
  }

  async DeleteRoom(id: string): Promise<{ message: string }> {
    try{
      const resultado = await this.roomRepository.createQueryBuilder().delete().from(Rooms).where('roomId = :id', {id}).execute();

      if (resultado.affected === 0) {
        throw new NotFoundException('No se encontró la sala');
      }
      return { message: 'Se eliminó la sala correctamente' };
    } catch (error) {
      throw new InternalServerErrorException('Error al eliminar la sala');
    }
  } 
}
