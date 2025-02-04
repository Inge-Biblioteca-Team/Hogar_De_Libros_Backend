import { Test, TestingModule } from '@nestjs/testing';
import { FurnitureService } from './furniture.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Furniture } from './furniture.entity';
import { CreateFurnitureDto } from './DTO/create-furniture.dto';
import {
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

const furnitureEntity = {
  Id: 1,
  Description: 'Mesa',
  Location: 'Sala A',
  InChargePerson: 'Juan Perez',
  ConditionRating: 5,
  LicenseNumber: 'ABC123',
  Status: 'Disponible',
};

const createFurnitureDto: CreateFurnitureDto = {
  Description: 'Mesa',
  Location: 'Sala A',
  InChargePerson: 'Juan Perez',
  ConditionRating: 5,
  LicenseNumber: 'ABC123',
};

describe('FurnitureService', () => {
  let service: FurnitureService;
  let repository: Repository<Furniture>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FurnitureService,
        {
          provide: getRepositoryToken(Furniture),
          useValue: {
            create: jest.fn().mockReturnValue(furnitureEntity),
            save: jest.fn().mockResolvedValue(furnitureEntity),
            findOne: jest.fn().mockResolvedValue(furnitureEntity),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
      ],
    }).compile();

    service = module.get<FurnitureService>(FurnitureService);
    repository = module.get<Repository<Furniture>>(getRepositoryToken(Furniture));
  });

  it('should create furniture successfully', async () => {
    await expect(service.create(createFurnitureDto)).resolves.toEqual({
      message: 'Mobiliario creado con exito',
    });
    expect(repository.create).toHaveBeenCalledWith(createFurnitureDto);
    expect(repository.save).toHaveBeenCalledWith(furnitureEntity);
  });

  it('should throw an error if furniture creation fails', async () => {
    jest.spyOn(repository, 'save').mockRejectedValue(new Error('DB Error'));
    await expect(service.create(createFurnitureDto)).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('should throw NotFoundException if furniture does not exist during update', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(null);
    await expect(service.update(99, createFurnitureDto)).rejects.toThrowError(
      'Error al dar de baja el mobiliario',
    );
  });

  it('should find furniture by ID', async () => {
    await expect(service.findOne(1)).resolves.toEqual(furnitureEntity);
  });

  it('should throw NotFoundException if furniture is not found', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(null);
    await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
  });

  it('should update furniture successfully', async () => {
    await expect(service.update(1, createFurnitureDto)).resolves.toEqual({
      message: 'Mobiliario actualizado con exito',
    });
  });

  it('should throw NotFoundException if furniture is not found during status change', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(null);
    await expect(service.DowFurniture(99)).rejects.toThrowError(
      'Error al dar de baja el mobiliario',
    );
  });
  it('should change furniture status to Baja', async () => {
    await expect(service.DowFurniture(1)).resolves.toEqual({
      message: 'Mobiliario dado de baja con exito',
    });
  });

  it('should throw NotFoundException if furniture is not found during status change', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(null);
    await expect(service.DowFurniture(99)).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException if trying to update a furniture with BAJA status', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue({
      ...furnitureEntity,
      Status: 'BAJA',
    });
    await expect(service.update(1, createFurnitureDto)).rejects.toThrowError(
      'No se puede actualizar un mobiliario con estado BAJA',
    );
  });
  
});
