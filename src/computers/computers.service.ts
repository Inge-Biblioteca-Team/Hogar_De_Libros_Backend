import { Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Computer } from './computer.entity';
import { Repository } from 'typeorm';
import { ComputerDTO } from './DTO/create-computer.dto';
import { PaginationQueryDTO } from './DTO/pagination-querry.dto';
import { skip } from 'node:test';
import { ComputerModifyDTO } from './DTO/modify-computer.dto';

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
  // método para ver todos los equipos de cómputo activos
  async getActiveComputers({ Limit, Offset }: PaginationQueryDTO) {
    return this.computerRepository.find({
      skip: Offset,
      take: Limit,
      where: { EquipmentStatus: 'Activo' },
    });
  }
  // método para ver todos los equipos de cómputo.
  async getComputers({
    Limit,
    Offset,
  }: PaginationQueryDTO): Promise<Computer[]> {
    return this.computerRepository.find({ skip: Offset, take: Limit });
  }
  // método para modificar un equipo de cómputo
  async modifyComputer(
    EquipmentUniqueCode: number,
    computerModifyDTO: ComputerModifyDTO,
  ) {
    return this.computerRepository.update(
      { EquipmentUniqueCode },
      computerModifyDTO,
    );
  }
  // método para buscar un equipo de cómputo por su codigo unico
  async FindById(EquipmentUniqueCode: number): Promise<Computer> {
    return this.computerRepository.findOne({
      where: { EquipmentUniqueCode: EquipmentUniqueCode },
    });
  }
  // método para inactivar un equipo de cómputo
  async DisableEquipment(EquipmentUniqueCode: number) {
    return this.computerRepository.update(
      { EquipmentUniqueCode },
      { EquipmentStatus: 'Inactivo' },
    );
  }
  // método para buscar equipos de cómputo por su número de máquina
  async FindByMachineNumber(
    MachineNumber: number,
    { Limit, Offset }: PaginationQueryDTO,
  ): Promise<Computer[]> {
    return this.computerRepository.find({
      skip: Offset,
      take: Limit,
      where: { MachineNumber: MachineNumber },
    });
  }
  // método para buscar equipos de cómputo por su marca
  async FindByBrand(
    EquipmentBrand: string,
    { Limit, Offset }: PaginationQueryDTO,
  ): Promise<Computer[]> {
    return this.computerRepository.find({
      skip: Offset,
      take: Limit,
      where: { EquipmentBrand: EquipmentBrand },
    });
  }
}
