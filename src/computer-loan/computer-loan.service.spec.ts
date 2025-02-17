import { Test, TestingModule } from '@nestjs/testing';
import { ComputerLoanService } from './computer-loan.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ComputerLoan } from './computer-loan.entity';
import { WorkStationsService } from 'src/work-stations/work-stations.service';
import { CreateComputerLoanDto } from './DTO/create-computer-loan.dto';
import { UpdateComputerLoanDto } from './DTO/update-computer-loan.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('ComputerLoanService', () => {
  let service: ComputerLoanService;
  let repository: Repository<ComputerLoan>;
  let workStationsService: WorkStationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComputerLoanService,
        {
          provide: getRepositoryToken(ComputerLoan),
          useClass: Repository,
        },
        {
          provide: WorkStationsService,
          useValue: {
            getByNumberMachine: jest.fn(),
            changeMachineStatus: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ComputerLoanService>(ComputerLoanService);
    repository = module.get<Repository<ComputerLoan>>(getRepositoryToken(ComputerLoan));
    workStationsService = module.get<WorkStationsService>(WorkStationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('CreateComputerLoan', () => {
    it('should create a computer loan successfully', async () => {
      const dto: CreateComputerLoanDto = {
        MachineNumber: 123,
        UserName: 'John Doe',
        cedula: '123456789',
      };
      
      jest.spyOn(workStationsService, 'getByNumberMachine').mockResolvedValue({
        MachineNumber: 123,
        Location: 'Lab 1',
        computers: [],
        computerLoans: [],
        Status: 'Disponible',
      } as any);
      jest.spyOn(repository, 'save').mockResolvedValue(dto as any);
      jest.spyOn(workStationsService, 'changeMachineStatus').mockResolvedValue(undefined);

      const result = await service.CreateComputerLoan(dto);
      expect(result).toEqual({ message: 'Exito al general el prestamo' });
    });

    it('should throw an error if machine is not found', async () => {
      jest.spyOn(workStationsService, 'getByNumberMachine').mockResolvedValue(null);
      const dto: CreateComputerLoanDto = {
        MachineNumber: 123,
        UserName: 'John Doe',
        cedula: '123456789',
      };

      await expect(service.CreateComputerLoan(dto)).rejects.toThrow(HttpException);
    });
  });

  describe('FinalizeComputerLoan', () => {
    it('should finalize a computer loan successfully', async () => {
      const dto: UpdateComputerLoanDto = { MachineNumber: 123 };
      
      jest.spyOn(repository, 'findOne').mockResolvedValue({ Status: 'En curso', LoanExpireDate: null } as any);
      jest.spyOn(repository, 'save').mockResolvedValue(undefined);
      jest.spyOn(workStationsService, 'changeMachineStatus').mockResolvedValue(undefined);
      
      const result = await service.FinalizeComputerLoan(dto);
      expect(result).toEqual({ message: 'Éxito al finalizar el préstamo' });
    });

    it('should throw an error if no active loan is found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      const dto: UpdateComputerLoanDto = { MachineNumber: 123 };

      await expect(service.FinalizeComputerLoan(dto)).rejects.toThrow(HttpException);
    });
  });
});