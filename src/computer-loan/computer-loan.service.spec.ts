import { Test, TestingModule } from '@nestjs/testing';
import { ComputerLoanService } from './computer-loan.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ComputerLoan } from './computer-loan.entity';
import { WorkStation } from 'src/computers/WorkStation.entity';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateComputerLoanDto } from './DTO/create-computer-loan.dto';

describe('ComputerLoanService', () => {
  let service: ComputerLoanService;
  let computerLoanRepository: Repository<ComputerLoan>;
  let workStationRepository: Repository<WorkStation>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComputerLoanService,
        {
          provide: getRepositoryToken(ComputerLoan),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(WorkStation),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ComputerLoanService>(ComputerLoanService);
    computerLoanRepository = module.get(getRepositoryToken(ComputerLoan));
    workStationRepository = module.get(getRepositoryToken(WorkStation));
    userRepository = module.get(getRepositoryToken(User));
  });

  describe('CreateComputerLoan', () => {
    it('should create a computer loan successfully', async () => {
      const createComputerLoanDto: CreateComputerLoanDto = {
        MachineNumber: 1,
        UserName: 'User Name',
        cedula: '12345678',
      };
      const mockWorkStation = { MachineNumber: 1, Status: 'Disponible' };
      const mockUser = { cedula: '12345678', name: 'Admin' };
      const mockComputerLoan = { ComputerLoanId: 1 };

      jest.spyOn(workStationRepository, 'findOne').mockResolvedValue(mockWorkStation as WorkStation);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser as User);
      jest.spyOn(computerLoanRepository, 'save').mockResolvedValue(mockComputerLoan as ComputerLoan);
      jest.spyOn(workStationRepository, 'save').mockResolvedValue(mockWorkStation as WorkStation);

      const result = await service.CreateComputerLoan(createComputerLoanDto);
      expect(result).toEqual({ success: true, loanId: mockComputerLoan.ComputerLoanId });
    });

    it('should throw an error if workstation is not found', async () => {
      jest.spyOn(workStationRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.CreateComputerLoan({
          MachineNumber: 1,
          UserName: 'User Name',
          cedula: '12345678',
        }),
      ).rejects.toThrow(new HttpException('No se encontró la máquina', HttpStatus.NOT_FOUND));
    });

    it('should throw an error if workstation is not available', async () => {
      const mockWorkStation = { MachineNumber: 1, Status: 'En Uso' };

      jest.spyOn(workStationRepository, 'findOne').mockResolvedValue(mockWorkStation as WorkStation);

      await expect(
        service.CreateComputerLoan({
          MachineNumber: 1,
          UserName: 'User Name',
          cedula: '12345678',
        }),
      ).rejects.toThrow(new HttpException('La máquina no está disponible para préstamo', HttpStatus.BAD_REQUEST));
    });
  });

  describe('getAllComputerLoans', () => {
    it('should return paginated computer loans', async () => {
      const paginationDTO = { Page: 1, Limit: 5 };
      const mockLoans = [{ ComputerLoanId: 1, UserName: 'User', LoanStartDate: new Date(), Status: 'En curso' }];
      const mockResult = [mockLoans, 1];

      jest.spyOn(computerLoanRepository, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue(mockResult),
      } as any);

      const result = await service.getAllComputerLoans(paginationDTO);
      expect(result).toEqual({
        data: mockLoans.map((loan) => ({
          ComputerLoanId: loan.ComputerLoanId,
          UserName: loan.UserName,
          LoanStartDate: loan.LoanStartDate,
          Status: loan.Status,
        })),
        count: 1,
      });
    });
  });

  describe('FinishComputerLoanByMachineNumber', () => {
    it('should finish a computer loan successfully', async () => {
      const mockLoan = {
        ComputerLoanId: 1,
        Status: 'En curso',
        workStation: { MachineNumber: 1, Status: 'En Uso' },
      };

      jest.spyOn(computerLoanRepository, 'findOne').mockResolvedValue(mockLoan as ComputerLoan);
      jest.spyOn(computerLoanRepository, 'save').mockResolvedValue(mockLoan as ComputerLoan);
      jest.spyOn(workStationRepository, 'save').mockResolvedValue(mockLoan.workStation as WorkStation);

      const result = await service.FinishComputerLoanByMachineNumber(1);
      expect(result).toBe('Préstamo finalizado');
    });

    it('should return a message if no active loan is found', async () => {
      jest.spyOn(computerLoanRepository, 'findOne').mockResolvedValue(null);

      const result = await service.FinishComputerLoanByMachineNumber(1);
      expect(result).toBe('No se encontró un préstamo activo para esta máquina');
    });
  });
});
