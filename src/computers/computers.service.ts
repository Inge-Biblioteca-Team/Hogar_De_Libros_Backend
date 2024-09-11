/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Computer } from './computer.entity';
import { Repository } from 'typeorm';
import { ComputerDTO } from './DTO/create-computer.dto';
import { PaginationQueryDTO } from './DTO/pagination-querry.dto';
import { ModifyComputerDTO } from './DTO/modify-computer.dto';
import { WorkStation } from './WorkStation.entity';

@Injectable()
export class ComputersService {
  constructor(
    @InjectRepository(Computer)
    private computerRepository: Repository<Computer>,
    @InjectRepository(WorkStation)
    private workStationRepository: Repository<WorkStation>,
  ) {}
  // método para agregar un equipo de cómputo
  async addComputer(computerDTO: ComputerDTO): Promise<Computer> {
    const computer = this.computerRepository.create(computerDTO);

    // Buscar una estación de trabajo existente con el mismo MachineNumber
    let workStation = await this.workStationRepository.findOne({ where: { MachineNumber: computerDTO.MachineNumber } });

    // Si no existe, crear una nueva estación de trabajo
    if (!workStation) {
      workStation = new WorkStation();
      workStation.MachineNumber = computerDTO.MachineNumber;
      workStation.WorkStation = computerDTO.MachineNumber; // Asignar el número de máquina del DTO

      // Guardar la nueva estación de trabajo en la base de datos
      workStation = await this.workStationRepository.save(workStation);
    }

    // Asociar la estación de trabajo al equipo de cómputo
    computer.workStation = workStation;

    // Guardar el equipo de cómputo en la base de datos
    return await this.computerRepository.save(computer);
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

  async setWorkStationMaintenance(WorkStation: number): Promise<WorkStation> {
    const workStation = await this.workStationRepository.findOne({
      where: { WorkStation },
    });
    if (!workStation) {
      throw new NotFoundException(
        `La WorkStation con código ${WorkStation} no fue encontrada`,
      );
    }
    workStation.Status = 'Mantenimiento';
    return this.workStationRepository.save(workStation);
  }

  async setWorkStationAvalible(WorkStation: number): Promise<WorkStation> {
    const workStation = await this.workStationRepository.findOne({
      where: { WorkStation },
    });
    if (!workStation) {
      throw new NotFoundException(
        `La WorkStation con código ${WorkStation} no fue encontrada`,
      );
    }
    workStation.Status = 'Disponible';
    return this.workStationRepository.save(workStation);
  }

  async setWorkStationInUse(WorkStation: number): Promise<WorkStation> {
    const workStation = await this.workStationRepository.findOne({
      where: { WorkStation },
    });
    if (!workStation) {
      throw new NotFoundException(
        `La WorkStation con código ${WorkStation} no fue encontrada`,
      );
    }
    workStation.Status = 'En uso';
    return this.workStationRepository.save(workStation);
  }

  async getStatusWorkStation(): Promise<{ MachineNumber: number; Status: string }[]> {
    return this.workStationRepository.find({
      select: ['MachineNumber', 'Status'],
      order: { MachineNumber: 'ASC' },
    });
  }
  
}
