import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Computer } from './computer.entity';
import { Repository } from 'typeorm';
import { ComputerDTO } from './DTO/create-computer.dto';
import { PaginationQueryDTO } from './DTO/pagination-querry.dto';
import { ModifyComputerDTO } from './DTO/modify-computer.dto';

@Injectable()
export class ComputersService {
  constructor(
    @InjectRepository(Computer)
    private computerRepository: Repository<Computer>,
  ) {}
  // método para agregar un equipo de cómputo
  async addComputer(computerDTO: ComputerDTO): Promise<Computer> {
    const newComputer = this.computerRepository.create(computerDTO);
    return this.computerRepository.save(newComputer);
  }

  // método para modificar un equipo de cómputo
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
  async DisableEquipment(EquipmentUniqueCode: number): Promise<Computer> {
    const Equipment = await this.computerRepository.findOne({
      where: { EquipmentUniqueCode: EquipmentUniqueCode },
    });
    if (!Equipment) {
      throw new NotFoundException('The equipment does not exist');
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
      query.andWhere('computer.EquipmentBrand = :EquipmentBrand', {
        EquipmentBrand,
      });
    }
    if (EquipmentCategory) {
      query.andWhere('computer.EquipmentCategory = :EquipmentCategory', {
        EquipmentCategory,
      });
    }
    if (Status) {
      query.andWhere('computer.Status = :Status', {
        Status,
      });
    }

    query.skip((Page - 1) * Limit).take(Limit);
    const [data, count] = await query.getManyAndCount();
    return { data, count };
  }
}
