/* eslint-disable prettier/prettier */
import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ComputerLoan } from './computer-loan.entity';
import { IsNull, Repository } from 'typeorm';
import { CreateComputerLoanDto } from './DTO/create-computer-loan.dto';
import { PaginationQueryDTO } from './DTO/Pagination-querry.dto';
import { ResponseHistoryDto } from './DTO/response-history.dto';
import { WorkStationsService } from 'src/work-stations/work-stations.service';
import { UpdateComputerLoanDto } from './DTO/update-computer-loan.dto';

@Injectable()
export class ComputerLoanService {
  constructor(
    @InjectRepository(ComputerLoan)
    private computerLoanRepository: Repository<ComputerLoan>,
    private WsService: WorkStationsService,
  ) {}

  async CreateComputerLoan(
    createComputerLoanDto: CreateComputerLoanDto,
  ): Promise<{ message: string }> {
    try {
      const workStation = await this.WsService.getByNumberMachine(
        createComputerLoanDto.MachineNumber,
      );

      if (!workStation) {
        throw new HttpException(
          'No se encontró la máquina',
          HttpStatus.NOT_FOUND,
        );
      }

      if (workStation.Status !== 'Disponible') {
        throw new HttpException(
          'La máquina no está disponible para préstamo',
          HttpStatus.BAD_REQUEST,
        );
      }

      const computerLoan = {
        ...createComputerLoanDto,
        Status: 'En curso',
        LoanStartDate: new Date(),
      };

      await this.computerLoanRepository.save(computerLoan);

      await this.WsService.changeMachineStatus(
        createComputerLoanDto.MachineNumber,
        'En Uso',
      );
      return { message: 'Exito al general el prestamo' };
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async FinalizeComputerLoan(
    loan: UpdateComputerLoanDto,
  ): Promise<{ message: string }> {
    try {
      console.log(loan);
      const computerLoan = await this.computerLoanRepository.findOne({
        where: {
          MachineNumber: loan.MachineNumber,
          LoanExpireDate: IsNull(),
        },
      });
      if (!computerLoan) {
        throw new HttpException(
          'No se encontró un préstamo asociado a esta máquina',
          HttpStatus.NOT_FOUND,
        );
      }
      computerLoan.LoanExpireDate = new Date();
      computerLoan.Status = 'Finalizado';
      await this.computerLoanRepository.save(computerLoan);

      await this.WsService.changeMachineStatus(
        loan.MachineNumber,
        'Disponible',
      );
      return { message: 'Éxito al finalizar el préstamo' };
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async getAllComputerLoans(
    paginationDTO: PaginationQueryDTO,
  ): Promise<{ data: ResponseHistoryDto[]; count: number }> {
    const { Page = 1, Limit = 10, StartDate, MachineNumber } = paginationDTO;

    const query = this.computerLoanRepository
      .createQueryBuilder('computerLoan')
      .leftJoinAndSelect('computerLoan.workStation', 'workStation')
      .orderBy('computerLoan.LoanStartDate', 'DESC')
      .skip((Page - 1) * Limit)
      .take(Limit);

    if (StartDate)
      query.andWhere('Date(computerLoan.LoanStartDate) >= :StartDate', {
        StartDate,
      });

    if (MachineNumber) {
      query.andWhere('computerLoan.MachineNumber = :MachineNumber', {
        MachineNumber,
      });
    }
    const [computerLoans, count] = await query.getManyAndCount();

    const data = computerLoans.map((loan) => ({
      ComputerLoanId: loan.ComputerLoanId,
      workStation: loan.MachineNumber,
      UserName: loan.UserName,
      cedula: loan.cedula,
      LoanStartDate: loan.LoanStartDate,
      LoanExpireDate: loan.LoanExpireDate,
      Status: loan.Status,
    }));

    return { data, count };
  }
}
