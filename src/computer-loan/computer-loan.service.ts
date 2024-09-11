import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ComputerLoan } from './computer-loan.entity';
import { Repository } from 'typeorm';
import { ComputersService } from 'src/computers/computers.service';
import { CreateComputerLoanDto } from './DTO/create-computer-loan.dto';
import { UpdateComputerLoanDto } from './DTO/update-computer-loan.dto';
import { WorkStation } from 'src/computers/WorkStation.entity';
import { PaginationQueryDTO } from './DTO/Pagination-querry.dto';

@Injectable()
export class ComputerLoanService {
  constructor(
    @InjectRepository(ComputerLoan)
    private computerLoanRepository: Repository<ComputerLoan>,
    private computerService: ComputersService,
    @InjectRepository(WorkStation)
    private workStationRepository: Repository<WorkStation>,
  ) {}
  async CreateComputerLoan(createComputerLoanDto: CreateComputerLoanDto) {
      
      const workStation = await this.workStationRepository.findOne({
        where: { WorkStation: createComputerLoanDto.workStation },
        relations: ['computers'], 
      });
  
      if (!workStation) {
        return 'No se encontró la mawquina';
      }
  
      const computerLoan = new ComputerLoan();
      computerLoan.ComputerLoanReserveDate = createComputerLoanDto.ComputerLoanReserveDate;
      computerLoan.ComputerLoanExpireDate = createComputerLoanDto.ComputerLoanExpireDate;
  
      // Asignar la estación de trabajo al préstamo
      computerLoan.workStation = [workStation]; 
  
     
      return await this.computerLoanRepository.save(computerLoan);
    }
  

  async AcceptComputerLoanRequest(
    ComputerLoanId: number,
  ): Promise<ComputerLoan | string> {
    const computerLoan = await this.computerLoanRepository.findOne({
      where: { ComputerLoanId },
    });
    if (!computerLoan) {
      return 'No se encontró el préstamo';
    }
    computerLoan.Status = 'En curso';
    return this.computerLoanRepository.save(computerLoan);
  }

  async CancelComputerLoanRequest(
    ComputerLoanId: number,
  ): Promise<ComputerLoan | string> {
    const computerLoan = await this.computerLoanRepository.findOne({
      where: { ComputerLoanId },
    });
    if (!computerLoan) {
      return 'No se encontró el préstamo';
    }
    computerLoan.Status = 'Cancelado';
    return this.computerLoanRepository.save(computerLoan);
  }

  async ModifyComputerLoanRequest(
    ComputerLoanId: number,
    updateComputerLoanDto: UpdateComputerLoanDto,
  ): Promise<ComputerLoan> {
    const computerLoan = await this.computerLoanRepository.findOne({
      where: { ComputerLoanId },
    });
    if (!computerLoan) {
      throw new NotFoundException(
        `El el préstamo con código ${ComputerLoanId} no fue encontrado`,
      );
    }
    Object.assign(computerLoan, updateComputerLoanDto);
    return this.computerLoanRepository.save(computerLoan);
  }


  async getAllComputerLoans(
    paginationDTO: PaginationQueryDTO,
  ): Promise<{ data: ComputerLoan[]; count: number }> {
    const { Page = 1, Limit = 10 } = paginationDTO;

    // Construcción de la consulta
    const query = this.computerLoanRepository.createQueryBuilder('computerLoan')
      .skip((Page - 1) * Limit)
      .take(Limit)

    // Ejecución de la consulta
    const [computerLoans, count] = await query.getManyAndCount();

    // Retornar los datos y el conteo
    return { data: computerLoans, count };
  }
  
}
