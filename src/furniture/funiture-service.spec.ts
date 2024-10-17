import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FurnitureService } from './furniture.service';
import { Furniture } from './furniture.entity';
import { CreateFurnitureDto } from './DTO/create-furniture.dto';

describe('FurnitureService', () => {
  let service: FurnitureService;
  let repository: Repository<Furniture>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FurnitureService,
        {
          provide: getRepositoryToken(Furniture),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<FurnitureService>(FurnitureService);
    repository = module.get<Repository<Furniture>>(getRepositoryToken(Furniture));
  });

  describe('create', () => {
    it('should create and return a new furniture item', async () => {
      const dto: CreateFurnitureDto = {  Description :'Mesa de oficina',
        Location : 'Sala de reuniones',
        InChargePerson :'Juan Pérez',
        ConditionRating :4,
        LicenseNumber : 'ABC123', };
      const savedFurniture = { id: 1, ...dto };
      
      jest.spyOn(repository, 'create').mockReturnValue(savedFurniture as any);
      jest.spyOn(repository, 'save').mockResolvedValue(savedFurniture as any);

      const result = await service.create(dto);
      expect(result).toEqual(savedFurniture);
    });
  });

  describe('findOne', () => {
    it('should return a furniture item by id', async () => {
      const furniture = { id: 1, /* otros campos */ };
      jest.spyOn(repository, 'findOne').mockResolvedValue(furniture as any);

      const result = await service.findOne(1);
      expect(result).toEqual(furniture);
    });

    it('should throw NotFoundException if furniture is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the updated furniture item', async () => {
      const dto: CreateFurnitureDto = { Description :'Mesa de oficina',
        Location : 'Sala de reuniones',
        InChargePerson :'Juan Pérez',
        ConditionRating :4,
        LicenseNumber : 'ABC123', };
      const existingFurniture = { id: 1, Status: 'ACTIVO' };
      const updatedFurniture = { ...existingFurniture, ...dto };

      jest.spyOn(repository, 'findOne').mockResolvedValue(existingFurniture as any);
      jest.spyOn(repository, 'update').mockResolvedValue(undefined);
      jest.spyOn(service, 'findOne').mockResolvedValue(updatedFurniture as any);

      const result = await service.update(1, dto);
      expect(result).toEqual(updatedFurniture);
    });

    it('should throw NotFoundException if furniture is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.update(1, {} as CreateFurnitureDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if furniture status is "BAJA"', async () => {
      const furniture = { id: 1, Status: 'BAJA' };
      jest.spyOn(repository, 'findOne').mockResolvedValue(furniture as any);

      await expect(service.update(1, {} as CreateFurnitureDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('DowFurniture', () => {
    it('should update the status to "Baja"', async () => {
      const furniture = { id: 1, Status: 'ACTIVO' };
      const updatedFurniture = { ...furniture, Status: 'Baja' };

      jest.spyOn(repository, 'findOne').mockResolvedValue(furniture as any);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedFurniture as any);

      const result = await service.DowFurniture(1);
      expect(result.Status).toBe('Baja');
    });

    it('should throw NotFoundException if furniture is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.DowFurniture(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('NAFurniture', () => {
    it('should update the status to "N.A."', async () => {
      const furniture = { id: 1, Status: 'ACTIVO' };
      const updatedFurniture = { ...furniture, Status: 'N.A.' };

      jest.spyOn(repository, 'findOne').mockResolvedValue(furniture as any);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedFurniture as any);

      const result = await service.NAFurniture(1);
      expect(result.Status).toBe('N.A.');
    });

    it('should throw BadRequestException if furniture status is "Baja"', async () => {
      const furniture = { id: 1, Status: 'Baja' };
      jest.spyOn(repository, 'findOne').mockResolvedValue(furniture as any);

      await expect(service.NAFurniture(1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('SEFurniture', () => {
    it('should update the status to "S.E."', async () => {
      const furniture = { id: 1, Status: 'ACTIVO' };
      const updatedFurniture = { ...furniture, Status: 'S.E.' };

      jest.spyOn(repository, 'findOne').mockResolvedValue(furniture as any);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedFurniture as any);

      const result = await service.SEFurniture(1);
      expect(result.Status).toBe('S.E.');
    });

    it('should throw BadRequestException if furniture status is "Baja"', async () => {
      const furniture = { id: 1, Status: 'Baja' };
      jest.spyOn(repository, 'findOne').mockResolvedValue(furniture as any);

      await expect(service.SEFurniture(1)).rejects.toThrow(BadRequestException);
    });
  });
});
