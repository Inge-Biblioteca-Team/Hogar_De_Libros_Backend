/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ComputerLoan } from './computer-loan.entity';
import { Repository } from 'typeorm';
import { CreateComputerLoanDto } from './DTO/create-computer-loan.dto';
import { WorkStation } from 'src/computers/WorkStation.entity';
import { PaginationQueryDTO } from './DTO/Pagination-querry.dto';
import { User } from 'src/user/user.entity';
import { ResponseHistoryDto } from './DTO/response-history.dto';

@Injectable()
export class ComputerLoanService {
  constructor(
    @InjectRepository(ComputerLoan)
    private computerLoanRepository: Repository<ComputerLoan>,
    @InjectRepository(WorkStation)
    private workStationRepository: Repository<WorkStation>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async CreateComputerLoan(createComputerLoanDto: CreateComputerLoanDto) {
    const workStation = await this.workStationRepository.findOne({
      where: { MachineNumber: createComputerLoanDto.MachineNumber },
      relations: ['computers', 'computerLoans'],
    });
  
    if (!workStation) {
      throw new HttpException('No se encontró la máquina', HttpStatus.NOT_FOUND);
    }
    
    if (workStation.Status !== 'Disponible') {
      throw new HttpException('La máquina no está disponible para préstamo', HttpStatus.BAD_REQUEST);
    }
  
    const user = await this.userRepository.findOne({
      where: { cedula: createComputerLoanDto.cedula },
    });
  
    if (!user) {
      throw new HttpException('La cedula no corresponde a un administrador', HttpStatus.NOT_FOUND);
    }
  
    const computerLoan = new ComputerLoan();
    computerLoan.UserName = createComputerLoanDto.UserName;
    computerLoan.user = user;
    computerLoan.workStation = workStation;
    computerLoan.LoanStartDate = new Date();
    computerLoan.Status = 'En curso';
  
    workStation.Status = 'En Uso';
    await this.workStationRepository.save(workStation);
  
    const savedLoan = await this.computerLoanRepository.save(computerLoan);
  
    return { success: true, loanId: savedLoan.ComputerLoanId };
  }
  
  async getAllComputerLoans(
    paginationDTO: PaginationQueryDTO,
  ): Promise<{ data: ResponseHistoryDto[]; count: number }> {
    const { Page = 1, Limit = 10 } = paginationDTO;

    const query = this.computerLoanRepository
      .createQueryBuilder('computerLoan')
      .leftJoinAndSelect('computerLoan.workStation', 'workStation')
      .leftJoinAndSelect('computerLoan.user', 'user')
      .orderBy('computerLoan.LoanStartDate', 'DESC')
      .skip((Page - 1) * Limit)
      .take(Limit);

    const [computerLoans, count] = await query.getManyAndCount();

    const data = computerLoans.map((loan) => ({
      ComputerLoanId: loan.ComputerLoanId,
      workStation: loan.MachineNumber,
      UserName: loan.UserName,
      AdminName: loan.user.name,
      LoanStartDate: loan.LoanStartDate,
      LoanExpireDate: loan.LoanExpireDate,
      Status: loan.Status,
    }));

    return { data, count };
  }

  async FinishComputerLoanByMachineNumber(
    machineNumber: number,
  ): Promise<string> {
    const computerLoan = await this.computerLoanRepository.findOne({
      where: {
        workStation: { MachineNumber: machineNumber },
        Status: 'En curso',
      },
      relations: ['workStation'],
    });

    if (!computerLoan) {
      return 'No se encontró un préstamo activo para esta máquina';
    }

    computerLoan.LoanExpireDate = new Date();
    computerLoan.Status = 'Finalizado';

    const workStation = computerLoan.workStation;
    workStation.Status = 'Disponible';
    await this.workStationRepository.save(workStation);

    await this.computerLoanRepository.save(computerLoan);

    return 'Préstamo finalizado';
  }
  
}
