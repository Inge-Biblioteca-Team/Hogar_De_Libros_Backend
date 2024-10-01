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

  async create(createRoomDto: CreateRoomDto) {
    try {
      await this.roomRepository.save(createRoomDto);
      return {
        message: 'Se creó la sala correctamente',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Error al crear la sala',
      );
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

  async update(id: number, updateRoomDto: UpdateRoomDto) {
    try {
      const findroom = await this.roomRepository.findOne({
        where: { roomId: id },
      });
      if (!findroom) {
        throw new NotFoundException('No se encontró la sala.');
      }
      await this.roomRepository.update(id, updateRoomDto);
      return {
        message: 'Se actualizó la sala correctamente',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Error al modificar la sala',
      );
    }
  }

  async updateStatusMaintenance(id: number) {
    try {
      const findroom = await this.roomRepository.findOne({
        where: { roomId: id },
      });
      if (!findroom) {
        throw new NotFoundException('No se encontró la sala.');
      }
      await this.roomRepository.update(id, { status: 'M' });
      return {
        message:
          'Se actualizó el estado de la sala a en mantenimiento correctamente',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Error al actualizar el estado de la sala',
      );
    }
  }

  async updateStatusClosed(id: number) {
    try {
      const findroom = await this.roomRepository.findOne({
        where: { roomId: id },
      });
      if (!findroom) {
        throw new NotFoundException('No se encontró la sala.');
      }
      await this.roomRepository.update(id, { status: 'C' });
      return {
        message: 'Se actualizó el estado de la sala a clausurada correctamente',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Error al actualizar el estado de la sala',
      );
    }
  }

  async updateStatusAvailable(id: number) {
    try {
      const findroom = await this.roomRepository.findOne({
        where: { roomId: id },
      });
      if (!findroom) {
        throw new NotFoundException('No se encontró la sala.');
      }
      await this.roomRepository.update(id, { status: 'D' });
      return {
        message: 'Se actualizó el estado de la sala a disponible correctamente',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Error al actualizar el estado de la sala',
      );
    }
  }
}
