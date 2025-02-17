import { Test, TestingModule } from '@nestjs/testing';
import { AdvicesService } from './advices.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Advice } from './entities/advice.entity';
import { CreateAdviceDto } from './dto/create-advice.dto';
import { UpdateAdviceDto } from './dto/update-advice.dto';
import { Paginacion_AdviceDTO } from './dto/Paginacion-Advice.dto';

describe('AdvicesService', () => {
  let service: AdvicesService;
  let repository: Repository<Advice>;

  const mockAdviceRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue({
      orderBy: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockReturnValue([[{}, {}], 2]),
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      execute: jest.fn(),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdvicesService,
        {
          provide: getRepositoryToken(Advice),
          useValue: mockAdviceRepository,
        },
      ],
    }).compile();

    service = module.get<AdvicesService>(AdvicesService);
    repository = module.get<Repository<Advice>>(getRepositoryToken(Advice));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createNewAdvice', () => {
    it('should create a new advice successfully', async () => {
      const dto: CreateAdviceDto = { reason: 'Testing' } as any;
      mockAdviceRepository.create.mockReturnValue(dto);
      mockAdviceRepository.save.mockResolvedValue({});

      const result = await service.createNewAdvice(dto);
      expect(result).toEqual({ message: 'El aviso se genero correctamente' });
    });

    it('should throw an error if creation fails', async () => {
      const dto: CreateAdviceDto = { reason: 'Testing' } as any;
      mockAdviceRepository.create.mockReturnValue(dto);
      mockAdviceRepository.save.mockRejectedValue(new Error('Test Error'));

      await expect(service.createNewAdvice(dto)).rejects.toThrow(
        new InternalServerErrorException('Test Error'),
      );
    });
  });

  describe('editAdvice', () => {
    it('should edit an advice successfully', async () => {
      const dto: UpdateAdviceDto = { reason: 'Updated Reason' } as any;
      const existingAdvice = { id_Advice: 1, reason: 'Initial Reason' } as any;
      mockAdviceRepository.findOne.mockResolvedValue(existingAdvice);
      mockAdviceRepository.save.mockResolvedValue({});

      const result = await service.editAdvice(dto, 1);
      expect(result).toEqual({ message: 'El aviso se modifico correctamente' });
    });

    it('should throw NotFoundException if advice not found', async () => {
      mockAdviceRepository.findOne.mockResolvedValue(null);
      await expect(service.editAdvice({} as UpdateAdviceDto, 1)).rejects.toThrow(
        new NotFoundException('Aviso no encontrado'),
      );
    });
  });

  describe('deleteAdvice', () => {
    it('should delete an advice successfully', async () => {
      const advice = { id_Advice: 1 } as any;
      mockAdviceRepository.findOne.mockResolvedValue(advice);
      mockAdviceRepository.remove.mockResolvedValue(undefined);

      const result = await service.deleteAdvice(1);
      expect(result).toEqual({ message: 'El aviso se elimino correctamente' });
    });

    it('should throw NotFoundException if advice not found', async () => {
      mockAdviceRepository.findOne.mockResolvedValue(null);
      await expect(service.deleteAdvice(1)).rejects.toThrow(
        new NotFoundException('Aviso no encontrado'),
      );
    });
  });

  describe('getAdvice', () => {
    it('should return paginated list of advices with filters', async () => {
      const params: Paginacion_AdviceDTO = { page: 1, limit: 5 };
      const result = await service.getAdvice(params);
      expect(result).toEqual({ data: [{}, {}], count: 2 });
      expect(mockAdviceRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('updateExpiredAdvice', () => {
    it('should update expired advices successfully', async () => {
      await service.updateExpiredAdvice();
      expect(mockAdviceRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });

  
});
