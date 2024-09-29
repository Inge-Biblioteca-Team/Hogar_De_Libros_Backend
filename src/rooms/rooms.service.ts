import { Injectable, NotFoundException } from '@nestjs/common';
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

  create(createRoomDto: CreateRoomDto) {
    return 'This action adds a new room';
  }

  async findAllRooms(
    filter: getRoomDto,
  ): Promise<{ data: CreateRoomDto[]; count: number }> {
    const { page = 1, limit = 10 } = filter;
    const query = this.roomRepository.createQueryBuilder('room');
  

    query.skip((page - 1) * limit).take(limit);
  
    
    const [rooms, count] = await query.getManyAndCount();
  
    
    if (!rooms || rooms.length === 0) {
      throw new NotFoundException('No se encontraron salas.');
    }
  
    return { data: rooms, count };
  }
  
  findOne(id: number) {
    return `This action returns a #${id} room`;
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    return `This action updates a #${id} room`;
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
}
