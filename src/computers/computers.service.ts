/* eslint-disable prettier/prettier */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Computer } from './computer.entity';
import { Repository } from 'typeorm';
import { ComputerDTO } from './DTO/create-computer.dto';
import { PaginationQueryDTO } from './DTO/pagination-querry.dto';
import { ModifyComputerDTO } from './DTO/modify-computer.dto';
import { WorkStationsService } from 'src/work-stations/work-stations.service';

@Injectable()
export class ComputersService {
  constructor(
    @InjectRepository(Computer)
    private computerRepository: Repository<Computer>,
    private WsService: WorkStationsService,
  ) {}

  
  // PROMISE MESSAGE
  async createComputer(
    createComputerDto: ComputerDTO,
  ): Promise<{ message: string }> {
    try {
      const station = await this.WsService.ExistMachine(
        createComputerDto.MachineNumber,
      );

      const computer = this.computerRepository.create({
        ...createComputerDto,
        workStation: station,
      });
      this.computerRepository.save(computer);

      return { message: 'Exito al añadir el componente' };
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new InternalServerErrorException(errorMessage);
    }
  }



  async findByEquipmentUniqueCode(
    EquipmentUniqueCode: number,
  ): Promise<Computer> {
    const computer = await this.computerRepository.findOne({
      where: { EquipmentUniqueCode },
    });
    if (!computer) {
      throw new NotFoundException(
        `El equipo de cómputo con código ${EquipmentUniqueCode} no fue encontrado`,
      );
    }

    // Devuelve el equipo encontrado
    return computer;
  }
  // método para modificar un equipo de cómputo
  // PROMISE MESSAGE
  async modifyComputer(
    EquipmentUniqueCode: number,
    modifyComputerDTO: ModifyComputerDTO,
  ) {
    return this.computerRepository.update(
      { EquipmentUniqueCode },
      modifyComputerDTO,
    );
  }
  // método para inactivar un equipo de cómputo
  // PROMISE MESSAGE
  async DisableEquipment(EquipmentUniqueCode: number): Promise<Computer> {
    const Equipment = await this.computerRepository.findOne({
      where: { EquipmentUniqueCode: EquipmentUniqueCode },
    });
    if (!Equipment) {
      throw new NotFoundException('El equipo no existe');
    }
    Equipment.Status = false;
    return this.computerRepository.save(Equipment);
  }

  async getAllComputers(
    paginationDTO: PaginationQueryDTO,
  ): Promise<{ data: Computer[]; count: number }> {
    const {
      Page = 1,
      Limit = 10,
      EquipmentUniqueCode,
      MachineNumber,
      EquipmentBrand,
      EquipmentCategory,
      Status,
    } = paginationDTO;

    const query = this.computerRepository.createQueryBuilder('computer');
    if (EquipmentUniqueCode) {
      query.andWhere('computer.EquipmentUniqueCode = :EquipmentUniqueCode', {
        EquipmentUniqueCode,
      });
    }
    if (MachineNumber) {
      query.andWhere('computer.MachineNumber = :MachineNumber', {
        MachineNumber,
      });
    }
    if (EquipmentBrand) {
      query.andWhere('computer.EquipmentBrand LIKE :EquipmentBrand', {
        EquipmentBrand: `%${EquipmentBrand}%`,
      });
    }
    if (EquipmentCategory) {
      query.andWhere('computer.EquipmentCategory = :EquipmentCategory', {
        EquipmentCategory,
      });
    }
    if (Status !== undefined) {
      query.andWhere('computer.Status = :Status', {
        Status,
      });
    }

    query.skip((Page - 1) * Limit).take(Limit);
    query.orderBy('computer.EquipmentUniqueCode', 'DESC');
    const [data, count] = await query.getManyAndCount();
    return { data, count };
  }
}
