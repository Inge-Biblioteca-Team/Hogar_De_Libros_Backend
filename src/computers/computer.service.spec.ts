import { Test, TestingModule } from '@nestjs/testing';
import { ComputersService } from './computers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Computer } from './computer.entity';
import { Repository } from 'typeorm';
import { WorkStation } from './WorkStation.entity';
import { ComputerDTO } from './DTO/create-computer.dto';
import { NotFoundException } from '@nestjs/common';

describe('ComputersService', () => {
  let service: ComputersService;
  let computerRepository: Repository<Computer>;
  let workStationRepository: Repository<WorkStation>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComputersService,
        {
          provide: getRepositoryToken(Computer),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(WorkStation),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ComputersService>(ComputersService);
    computerRepository = module.get(getRepositoryToken(Computer));
    workStationRepository = module.get(getRepositoryToken(WorkStation));
  });

  describe('createComputer', () => {
    it('should create a new computer', async () => {
      const createComputerDto: ComputerDTO = {
        MachineNumber: 1,
        EquipmentSerial: '12345',
        EquipmentBrand: 'Brand A',
        ConditionRating: 5,
        Observation: 'None',
        EquipmentCategory: 'Laptop',
      };

      const mockWorkStation = { MachineNumber: 1, Location: 'Biblioteca pública', Status: 'Disponible' };
      jest.spyOn(workStationRepository, 'findOne').mockResolvedValue(mockWorkStation as WorkStation);
      jest.spyOn(computerRepository, 'save').mockResolvedValue({ ...createComputerDto, workStation: mockWorkStation } as Computer);

      const result = await service.createComputer(createComputerDto);
      expect(result).toMatchObject(createComputerDto);
    });

    it('should create a new workstation if it does not exist', async () => {
      const createComputerDto: ComputerDTO = {
        MachineNumber: 2,
        EquipmentSerial: '67890',
        EquipmentBrand: 'Brand B',
        ConditionRating: 4,
        Observation: 'Slight scratches',
        EquipmentCategory: 'Desktop',
      };

      jest.spyOn(workStationRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(workStationRepository, 'save').mockResolvedValue({ MachineNumber: 2, Location: 'Biblioteca pública', Status: 'Disponible' } as WorkStation);
      jest.spyOn(computerRepository, 'save').mockResolvedValue({ ...createComputerDto } as Computer);

      const result = await service.createComputer(createComputerDto);
      expect(result).toMatchObject(createComputerDto);
    });
  });

  describe('findByEquipmentUniqueCode', () => {
    it('should find a computer by EquipmentUniqueCode', async () => {
      const mockComputer = { EquipmentUniqueCode: 1 };
      jest.spyOn(computerRepository, 'findOne').mockResolvedValue(mockComputer as Computer);

      const result = await service.findByEquipmentUniqueCode(1);
      expect(result).toEqual(mockComputer);
    });

    it('should throw NotFoundException if computer is not found', async () => {
      jest.spyOn(computerRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findByEquipmentUniqueCode(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('modifyComputer', () => {
    it('should modify a computer', async () => {
      const modifyComputerDTO = { ConditionRating: 3 };
      jest.spyOn(computerRepository, 'update').mockResolvedValue(undefined);

      await expect(service.modifyComputer(1, modifyComputerDTO)).resolves.toBeUndefined();
    });
  });

  describe('DisableEquipment', () => {
    it('should disable equipment', async () => {
      const mockComputer = { EquipmentUniqueCode: 1, Status: true };
      jest.spyOn(computerRepository, 'findOne').mockResolvedValue(mockComputer as Computer);
      jest.spyOn(computerRepository, 'save').mockResolvedValue({ ...mockComputer, Status: false } as Computer);

      const result = await service.DisableEquipment(1);
      expect(result.Status).toBe(false);
    });

    it('should throw NotFoundException if equipment is not found', async () => {
      jest.spyOn(computerRepository, 'findOne').mockResolvedValue(null);

      await expect(service.DisableEquipment(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAllComputers', () => {
    it('should return paginated computers', async () => {
      const mockComputers = [{ EquipmentUniqueCode: 1 }];
      jest.spyOn(computerRepository, 'createQueryBuilder').mockReturnValue({
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockComputers, 1]),
      } as any);

      const result = await service.getAllComputers({ Page: 1, Limit: 5 });
      expect(result).toEqual({ data: mockComputers, count: 1 });
    });
  });

  describe('SetWorkStationToMaintenance', () => {
    it('should set workstation to maintenance', async () => {
      const mockWorkStation = { MachineNumber: 1, Status: 'Disponible' };
      jest.spyOn(workStationRepository, 'findOne').mockResolvedValue(mockWorkStation as WorkStation);
      jest.spyOn(workStationRepository, 'save').mockResolvedValue({ ...mockWorkStation, Status: 'Mantenimiento' } as WorkStation);

      const result = await service.SetWorkStationToMaintenance(1, 'Sala', 'Admin');
      expect(result).toBe('Estado actualizado a Mantenimiento');
    });

    it('should return error message if workstation is not found', async () => {
      jest.spyOn(workStationRepository, 'findOne').mockResolvedValue(null);

      const result = await service.SetWorkStationToMaintenance(1, 'Sala', 'Admin');
      expect(result).toBe('No se encontró la máquina');
    });
  });

  describe('ResetWorkStation', () => {
    it('should reset workstation status to Disponible', async () => {
      const mockWorkStation = { MachineNumber: 1, Status: 'Mantenimiento' };
      jest.spyOn(workStationRepository, 'findOne').mockResolvedValue(mockWorkStation as WorkStation);
      jest.spyOn(workStationRepository, 'save').mockResolvedValue({ ...mockWorkStation, Status: 'Disponible' } as WorkStation);

      const result = await service.ResetWorkStation(1);
      expect(result).toBe('Estado actualizado a Disponible');
    });
  });

  describe('ReactiveMachine', () => {
    it('should reactivate machine if it is in maintenance', async () => {
      const mockWorkStation = { MachineNumber: 1, Status: 'Mantenimiento' };
      jest.spyOn(workStationRepository, 'findOne').mockResolvedValue(mockWorkStation as WorkStation);
      jest.spyOn(workStationRepository, 'save').mockResolvedValue({ ...mockWorkStation, Status: 'Disponible' } as WorkStation);

      const result = await service.ReactiveMachine(1);
      expect(result).toBe('El Equipo ha sido reactivado y ahora está disponible');
    });

    it('should return message if machine is not in maintenance', async () => {
      const mockWorkStation = { MachineNumber: 1, Status: 'Disponible' };
      jest.spyOn(workStationRepository, 'findOne').mockResolvedValue(mockWorkStation as WorkStation);

      const result = await service.ReactiveMachine(1);
      expect(result).toBe('El Equipo no está en mantenimiento, no se realizaron cambios');
    });
  });
});
