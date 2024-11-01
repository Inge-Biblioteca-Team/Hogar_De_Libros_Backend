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
  // PROMISE MESSAGE
  async createComputer(createComputerDto: ComputerDTO): Promise<Computer> {
    let workStation = await this.workStationRepository.findOne({
      where: { MachineNumber: createComputerDto.MachineNumber },
    });

    if (!workStation) {
      workStation = this.workStationRepository.create({
        MachineNumber: createComputerDto.MachineNumber,
        Location: 'Biblioteca pública',
        Status: 'Disponible',
      });
      await this.workStationRepository.save(workStation);
    }

    const computer = this.computerRepository.create({
      ...createComputerDto,
      workStation,
    });

    return this.computerRepository.save(computer);
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

  async getStatusWorkStation(): Promise<
    { MachineNumber: number; Status: string }[]
  > {
    return this.workStationRepository.find({
      select: ['MachineNumber', 'Status'],
      order: { MachineNumber: 'ASC' },
    });
  }
// PROMISE MESSAGE
  async SetWorkStationToMaintenance(
    machineNumber: number,
    location: string,
    userName: string,
  ): Promise<string> {
    const workStation = await this.workStationRepository.findOne({
      where: { MachineNumber: machineNumber },
    });

    if (!workStation) {
      return 'No se encontró la máquina';
    }

    const locationWitInCharge = `${location}; ${userName}`;

    workStation.Status = 'Mantenimiento';
    workStation.Location = locationWitInCharge;
    await this.workStationRepository.save(workStation);

    return 'Estado actualizado a Mantenimiento';
  }

  // PROMISE MESSAGE
  async ResetWorkStation(machineNumber: number): Promise<string> {
    const workStation = await this.workStationRepository.findOne({
      where: { MachineNumber: machineNumber },
    });

    if (!workStation) {
      return 'No se encontró la máquina';
    }

    workStation.Status = 'Disponible';
    workStation.Location = 'Biblioteca pública';
    await this.workStationRepository.save(workStation);

    return 'Estado actualizado a Disponible';
  }
// PROMISE MESSAGE
  async ReactiveMachine(machineNumber: number): Promise<string> {
    const workStation = await this.workStationRepository.findOne({
      where: { MachineNumber: machineNumber },
    });

    if (!workStation) {
      return 'No se encontró un equipo con ese número';
    }

    if (workStation.Status === 'Mantenimiento') {
      workStation.Status = 'Disponible';
      workStation.Location = 'Biblioteca Publica';
      await this.workStationRepository.save(workStation);
      return 'El Equipo ha sido reactivado y ahora está disponible';
    }

    return 'El Equipo no está en mantenimiento, no se realizaron cambios';
  }
}
