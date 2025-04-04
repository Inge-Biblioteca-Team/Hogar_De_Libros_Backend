/* eslint-disable prettier/prettier */
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkStation } from './entities/work-station.entity';
import { Not, Repository } from 'typeorm';
import { CreateWorkStationDto } from './dto/create-work-station.dto';
import { NotFoundError } from 'rxjs';
import { UpdateWorkStationDto } from './dto/update-work-station.dto';

@Injectable()
export class WorkStationsService {
  constructor(
    @InjectRepository(WorkStation)
    private workStationRepository: Repository<WorkStation>,
  ) {}

  async createWorkStation(
    data: CreateWorkStationDto,
  ): Promise<{ message: string }> {
    try {
      const station = await this.workStationRepository.findOne({
        where: { MachineNumber: data.MachineNumber },
      });
      if (station) {
        throw new ConflictException(
          `Ya existe un equipo con el numero de maquina ${data.MachineNumber}`,
        );
      }
      const Ws = this.workStationRepository.create(data);
      await this.workStationRepository.save(Ws);
      return { message: 'Exito al crear equipo' };
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async ExistMachine(machineNumber: number): Promise<WorkStation> {
    let station = await this.workStationRepository.findOne({
      where: { MachineNumber: machineNumber },
    });

    if (!station) {
      station = this.workStationRepository.create({
        MachineNumber: machineNumber,
        Location: 'Biblioteca publica municipal de nicoya',
      });
      await this.workStationRepository.save(station);
    }
    if (station) return station;
  }

  async changeMachineStatus(
    machineNumber: number,
    status: string,
  ): Promise<{ message: string }> {
    try {
      const station = await this.workStationRepository.findOne({
        where: { MachineNumber: machineNumber },
      });

      if (!station) {
        throw new NotFoundException(
          `La maquina con el número de máquina ${machineNumber} no fue encontrada.`,
        );
      }

      station.Status = status;

      await this.workStationRepository.save(station);

      return { message: 'Exito al cambiar el estado del la maquina' };
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async getByNumberMachine(machineNumber: number): Promise<WorkStation> {
    try {
      const station = await this.workStationRepository.findOne({
        where: { MachineNumber: machineNumber },
      });

      if (!station) {
        return;
      }

      return station;
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async getStatusWorkStation(): Promise<
    { MachineNumber: number; Status: string }[]
  > {
    return this.workStationRepository.find({
      select: ['MachineNumber', 'Status'],
      order: { MachineNumber: 'ASC' },
    });
  }

  async SetWorkStationToMaintenance(
    data: UpdateWorkStationDto,
  ): Promise<{ message: string }> {
    const workStation = await this.workStationRepository.findOne({
      where: { MachineNumber: data.MachineNumber },
    });

    if (!workStation) {
      throw new NotFoundException('No se encontró la máquina');
    }

    const locationWitInCharge = `${data.Location}`;

    workStation.Status = 'Mantenimiento';
    workStation.Location = locationWitInCharge;
    await this.workStationRepository.save(workStation);

    return { message: 'Estado actualizado a Mantenimiento' };
  }

  async ResetWorkStation(machineNumber: number): Promise<{ message: string }> {
    const workStation = await this.workStationRepository.findOne({
      where: { MachineNumber: machineNumber },
    });

    if (!workStation) {
      throw new NotFoundError('No se encontró la máquina');
    }

    workStation.Status = 'Disponible';
    workStation.Location = 'Biblioteca pública';
    await this.workStationRepository.save(workStation);

    return { message: 'Estado actualizado a Disponible' };
  }

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

  async countWs(): Promise<number> {
    return await this.workStationRepository.count({
      where: {
        Status: Not('Mantenimiento'),
      },
    });
  }
}
