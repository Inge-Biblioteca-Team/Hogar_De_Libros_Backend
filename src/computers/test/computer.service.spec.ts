import { Test, TestingModule } from '@nestjs/testing';
import { ComputersService } from './computers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Computer } from './computer.entity';
import { Repository } from 'typeorm';
import { WorkStationsService } from 'src/work-stations/work-stations.service';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';

const mockComputerRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    andWhere: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
  }),
};

const mockWorkStationsService = {
  ExistMachine: jest.fn(),
};

describe('ComputersService', () => {
  let service: ComputersService;
  let repository: Repository<Computer>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComputersService,
        {
          provide: getRepositoryToken(Computer),
          useValue: mockComputerRepository,
        },
        {
          provide: WorkStationsService,
          useValue: mockWorkStationsService,
        },
      ],
    }).compile();

    service = module.get<ComputersService>(ComputersService);
    repository = module.get<Repository<Computer>>(getRepositoryToken(Computer));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createComputer', () => {
    it('should create and return a success message', async () => {
      mockWorkStationsService.ExistMachine.mockResolvedValue({});
      mockComputerRepository.create.mockReturnValue({});
      mockComputerRepository.save.mockResolvedValue({});

      await expect(service.createComputer({ MachineNumber: 1 } as any))
        .resolves.toEqual({ message: 'Exito al añadir el componente' });
    });

    it('should throw an internal server error', async () => {
      mockWorkStationsService.ExistMachine.mockRejectedValue(new Error('Error interno'));
      await expect(service.createComputer({ MachineNumber: 1 } as any))
        .rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findByEquipmentUniqueCode', () => {
    it('should return a computer', async () => {
      mockComputerRepository.findOne.mockResolvedValue({ EquipmentUniqueCode: 1 });
      await expect(service.findByEquipmentUniqueCode(1)).resolves.toEqual({ EquipmentUniqueCode: 1 });
    });

    it('should throw NotFoundException if computer not found', async () => {
      mockComputerRepository.findOne.mockResolvedValue(null);
      await expect(service.findByEquipmentUniqueCode(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('modifyComputer', () => {
    it('should update a computer', async () => {
      mockComputerRepository.update.mockResolvedValue({ affected: 1 });
      await expect(service.modifyComputer(1, {} as any)).resolves.toEqual({ affected: 1 });
    });
  });

  describe('DisableEquipment', () => {
    it('should disable a computer', async () => {
      mockComputerRepository.findOne.mockResolvedValue({ EquipmentUniqueCode: 1, Status: true });
      mockComputerRepository.save.mockResolvedValue({ EquipmentUniqueCode: 1, Status: false });

      await expect(service.DisableEquipment(1)).resolves.toEqual({ EquipmentUniqueCode: 1, Status: false });
    });

    it('should throw NotFoundException if equipment does not exist', async () => {
      mockComputerRepository.findOne.mockResolvedValue(null);
      await expect(service.DisableEquipment(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAllComputers', () => {
    it('should return paginated computers', async () => {
      mockComputerRepository.createQueryBuilder().getManyAndCount.mockResolvedValue([[], 0]);
      await expect(service.getAllComputers({} as any)).resolves.toEqual({ data: [], count: 0 });
    });
  });
});
