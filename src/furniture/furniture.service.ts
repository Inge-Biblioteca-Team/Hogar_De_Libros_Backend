/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
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

  async create(
    createFurnitureDto: CreateFurnitureDto,
  ): Promise<{ message: string }> {
    try {
      const newFurniture = this.FurnitureRepository.create(createFurnitureDto);
      await this.FurnitureRepository.save(newFurniture);
      return { message: 'Mobiliario creado con exito' };
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al crear el mobiliario';
      throw new InternalServerErrorException(errorMessage);
    }
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
  ): Promise<{ message: string }> {
    try {
      const furniture = await this.FurnitureRepository.findOne({
        where: { Id: id },
      });

      if (!furniture) {
        throw new NotFoundException({
          message: `No hay mobiliario con el ID ${id}`,
        });
      }
      if (furniture.Status === 'BAJA') {
        throw new BadRequestException({
          message: `No se puede actualizar un mobiliario con estado BAJA`,
        });
      }
      await this.FurnitureRepository.update(id, updateFurniture);

      return { message: 'Mobiliario actualizado con exito' };
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al actualizar el mobiliario';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async DowFurniture(Id: number): Promise<{ message: string }> {
    try {
      const Furniture = await this.FurnitureRepository.findOne({
        where: { Id: Id },
      });
      if (!Furniture) {
        throw new NotFoundException({
          message: `No hay moviliario con el ${Id}`,
        });
      }
      Furniture.Status = 'Baja';
      await this.FurnitureRepository.save(Furniture);
      return { message: 'Mobiliario dado de baja con exito' };
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al dar de baja el mobiliario';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async NAFurniture(Id: number): Promise<{ message: string }> {
    try {
      const Furniture = await this.FurnitureRepository.findOne({
        where: { Id: Id },
      });
      if (!Furniture) {
        throw new NotFoundException({
          message: `No hay moviliario con el ${Id}`,
        });
      }
      if (Furniture.Status === 'Baja') {
        throw new BadRequestException({
          message: `No se puede cambiar el estado de un mobiliario dado de baja`,
        });
      }
      Furniture.Status = 'N.A.';
      await this.FurnitureRepository.save(Furniture);
      return { message: 'El estado del mobiliaro se cambio a N.A. con exito' };
    } catch (error) {
      const errorMessage =
        (error as Error).message ||
        'Error al cambiar el estado del mobiliario a N.A.';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  // PROMISE MESSAGE
  async SEFurniture(Id: number): Promise<{ message: string }> {
    try {
      const Furniture = await this.FurnitureRepository.findOne({
        where: { Id: Id },
      });
      if (!Furniture) {
        throw new NotFoundException({
          message: `No hay moviliario con el ${Id}`,
        });
      }
      if (Furniture.Status === 'Baja') {
        throw new BadRequestException({
          message: `No se puede cambiar el estado de un mobiliario dado de baja`,
        });
      }
      Furniture.Status = 'S.E.';
      await this.FurnitureRepository.save(Furniture);
      return { message: 'El estado del mobiliaro se cambio a S.E. con exito' };
    } catch (error) {
      const errorMessage =
        (error as Error).message ||
        'Error al cambiar el estado del mobiliario a S.E.';
      throw new InternalServerErrorException(errorMessage);
    }
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
      LicenseNumber,
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
    if (LicenseNumber) {
      queryBuilder.andWhere('furniture.LicenseNumber = :LicenseNumber', {
        LicenseNumber,
      });
    }

    const [data, count] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, count };
  }
}
