/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFurnitureDto } from './DTO/create-furniture.dto';
import { Furniture } from './furniture.entity';
import { PaginatedDTO } from './DTO/PaginationQueryDTO';

@Injectable()
export class FurnitureService {
  constructor(
    @InjectRepository(Furniture)
    private FurnitureRepository: Repository<Furniture>,
  ) {}

  async create(createFurnitureDto: CreateFurnitureDto): Promise<Furniture> {
    const newFurniture = this.FurnitureRepository.create(createFurnitureDto);
    return this.FurnitureRepository.save(newFurniture);
  }

  async findOne(id: number): Promise<Furniture> {
    const furniture = await this.FurnitureRepository.findOne({
      where: { Id: id },
    });
    if (!furniture) {
      throw new NotFoundException(`No hay moviliario con el ${id}`);
    }
    return furniture;
  }

  async update(
    id: number,
    updateFurniture: CreateFurnitureDto,
  ): Promise<Furniture> {
    const furniture = await this.FurnitureRepository.findOne({
      where: { Id: id },
    });

    if (!furniture) {
      throw new NotFoundException(`No hay mobiliario con el ID ${id}`);
    }
    if (furniture.Status === 'BAJA') {
      throw new BadRequestException(
        `No se puede actualizar un mobiliario con estado BAJA`,
      );
    }
    await this.FurnitureRepository.update(id, updateFurniture);

    return this.findOne(id);
  }

  async DowFurniture(Id: number): Promise<Furniture> {
    const Furniture = await this.FurnitureRepository.findOne({
      where: { Id: Id },
    });
    if (!Furniture) {
      throw new NotFoundException(`No hay moviliario con el ${Id}`);
    }
    Furniture.Status = 'Baja';
    return this.FurnitureRepository.save(Furniture);
  }

  async NAFurniture(Id: number): Promise<Furniture> {
    const Furniture = await this.FurnitureRepository.findOne({
      where: { Id: Id },
    });
    if (!Furniture) {
      throw new NotFoundException(`No hay moviliario con el ${Id}`);
    }
    if (Furniture.Status === 'Baja') {
      throw new BadRequestException(
        `No se puede cambiar el estado de un mobiliario dado de baja`,
      );
    }
    Furniture.Status = 'N.A.';
    return this.FurnitureRepository.save(Furniture);
  }

  async findAll(
    query: PaginatedDTO,
  ): Promise<{ data: Furniture[]; count: number }> {
    const {
      page = 1,
      limit = 10,
      Description,
      Location,
      InChargePerson,
      ConditionRating,
      Status,
    } = query;

    const queryBuilder =
      this.FurnitureRepository.createQueryBuilder('furniture');

    if (Description) {
      queryBuilder.andWhere('furniture.Description LIKE :Description', {
        Description: `%${Description}%`,
      });
    }
    if (Location) {
      queryBuilder.andWhere('furniture.Location LIKE :Location', {
        Location: `%${Location}%`,
      });
    }
    if (InChargePerson) {
      queryBuilder.andWhere('furniture.InChargePerson LIKE :InChargePerson', {
        InChargePerson: `%${InChargePerson}%`,
      });
    }
    if (ConditionRating) {
      queryBuilder.andWhere('furniture.ConditionRating = :ConditionRating', {
        ConditionRating,
      });
    }
    if (Status) {
      queryBuilder.andWhere('furniture.Status = :Status', { Status });
    }

    const [data, count] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, count };
  }
}
