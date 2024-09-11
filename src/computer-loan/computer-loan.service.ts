import { Injectable, NotFoundException } from '@nestjs/common';
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
      where: { WorkStation: createComputerLoanDto.workStation },
      relations: ['computers'],
    });
    if (!workStation) {
      return 'No se encontró la máquina';
    }
    const user = await this.userRepository.findOne({
      where: { cedula: createComputerLoanDto.AdminCedula },
    });
    if (!user) {
      return 'No se encontró el usuario';
    }

    const computerLoan = new ComputerLoan();
    computerLoan.UserName = createComputerLoanDto.UserName;
    computerLoan.AdminCedula = user.cedula; // Asignar la cédula del administrador desde el usuario relacionado
    computerLoan.user = user; // Establecer la relación con el usuario
    computerLoan.WorkStation = workStation.WorkStation;

    computerLoan.workStation = [workStation];

    return await this.computerLoanRepository.save(computerLoan);
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
    // uso del dto
    const data = computerLoans.map((loan) => ({
      workStation: loan.WorkStation,
      UserName: loan.UserName,
      AdminName: loan.user.name,
      LoanStartDate: loan.LoanStartDate,
      LoanExpireDate: loan.LoanExpireDate,
      Status: loan.Status,
    }));

    return { data, count };
  }
  async FinishComputerLoan(workStationNumber: number) {
    const workStation = await this.workStationRepository.findOne({
      where: { WorkStation: workStationNumber },
      relations: ['computerLoan'],
    });

    if (!workStation) {
      throw new NotFoundException('No se encontró la estación de trabajo');
    }

    const computerLoan = workStation.computerLoan;

    if (!computerLoan) {
      throw new NotFoundException(
        'No se encontró el préstamo asociado a la estación de trabajo',
      );
    }

    // Establecer la fecha y hora actual
    computerLoan.LoanExpireDate = new Date();
    computerLoan.Status = 'Finalizado';

    return await this.computerLoanRepository.save(computerLoan);
  }
}
