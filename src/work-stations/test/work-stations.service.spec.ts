import { Test, TestingModule } from '@nestjs/testing';
import { WorkStationsService } from './work-stations.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WorkStation } from './entities/work-station.entity';
import { NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { mock, MockProxy } from 'jest-mock-extended';
import { CreateWorkStationDto } from './dto/create-work-station.dto';
import { UpdateWorkStationDto } from './dto/update-work-station.dto';

describe('WorkStationsService', () => {
  let service: WorkStationsService;
  let workStationRepository: MockProxy<Repository<WorkStation>>;

  beforeEach(async () => {
    workStationRepository = mock<Repository<WorkStation>>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkStationsService,
        {
          provide: getRepositoryToken(WorkStation),
          useValue: workStationRepository,
        },
      ],
    }).compile();

    service = module.get<WorkStationsService>(WorkStationsService);
  });

  it('Debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('createWorkStation', () => {
    it('Debe crear una estación de trabajo exitosamente', async () => {
      const createWorkStationDto: CreateWorkStationDto = {
        MachineNumber: 2000,
        Location: 'Sala A',
        Status: 'Disponible',
      };

      
      workStationRepository.create.mockReturnValue(createWorkStationDto as WorkStation);
      workStationRepository.save.mockResolvedValue(createWorkStationDto as WorkStation);

      await expect(service.createWorkStation(createWorkStationDto)).resolves.toEqual({
        message: 'Exito al crear equipo',
      });
    });

    it('Debe lanzar un ConflictException si la estación ya existe', async () => {
      workStationRepository.findOne.mockResolvedValue({} as WorkStation);

      await expect(
        service.createWorkStation({
          MachineNumber: 101,
          Location: 'Sala A',
          Status: 'Disponible',
        }),
      ).rejects.toThrow('Ya existe un equipo con el numero de maquina ');
    });

    it('Debe lanzar un InternalServerErrorException si falla al guardar', async () => {
      workStationRepository.findOne.mockResolvedValue(null);
      workStationRepository.save.mockRejectedValue(new Error('Error de base de datos'));

      await expect(
        service.createWorkStation({
          MachineNumber: 101,
          Location: 'Sala A',
          Status: 'Disponible',
        }),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('getByNumberMachine', () => {
    it('Debe retornar una estación si existe', async () => {
      const workStation = { MachineNumber: 101, Status: 'Disponible' } as WorkStation;
      workStationRepository.findOne.mockResolvedValue(workStation);

      await expect(service.getByNumberMachine(101)).resolves.toEqual(workStation);
    });

    it('Debe retornar undefined si la estación no existe', async () => {
      workStationRepository.findOne.mockResolvedValue(null);
      await expect(service.getByNumberMachine(101)).resolves.toBeUndefined();
    });
  });

  describe('changeMachineStatus', () => {
    it('Debe cambiar el estado de la estación exitosamente', async () => {
      const workStation = { MachineNumber: 101, Status: 'Disponible' } as WorkStation;
      workStationRepository.findOne.mockResolvedValue(workStation);
      workStationRepository.save.mockResolvedValue({ ...workStation, Status: 'Ocupado' });

      await expect(service.changeMachineStatus(101, 'Ocupado')).resolves.toEqual({
        message: 'Exito al cambiar el estado del la maquina',
      });
    });

    it('Debe lanzar NotFoundException si la estación no existe', async () => {
      workStationRepository.findOne.mockResolvedValue(null);

      await expect(service.changeMachineStatus(101, 'Ocupado')).rejects.toThrow(
        new NotFoundException(`La maquina con el número de máquina 101 no fue encontrada.`),
      );
    });
  });

  describe('SetWorkStationToMaintenance', () => {
    it('Debe actualizar el estado a "Mantenimiento"', async () => {
      const workStation = { MachineNumber: 101, Status: 'Disponible' } as WorkStation;
      workStationRepository.findOne.mockResolvedValue(workStation);
      workStationRepository.save.mockResolvedValue({ ...workStation, Status: 'Mantenimiento' });

      const updateDto: UpdateWorkStationDto = { MachineNumber: 101, Location: 'Taller' };

      await expect(service.SetWorkStationToMaintenance(updateDto)).resolves.toEqual({
        message: 'Estado actualizado a Mantenimiento',
      });
    });

    it('Debe lanzar NotFoundException si la estación no existe', async () => {
      workStationRepository.findOne.mockResolvedValue(null);

      const updateDto: UpdateWorkStationDto = { MachineNumber: 101, Location: 'Taller' };

      await expect(service.SetWorkStationToMaintenance(updateDto)).rejects.toThrow(
        new NotFoundException('No se encontró la máquina'),
      );
    });
  });

  describe('ReactiveMachine', () => {
    it('Debe reactivar una estación en mantenimiento', async () => {
      const workStation = { MachineNumber: 101, Status: 'Mantenimiento' } as WorkStation;
      workStationRepository.findOne.mockResolvedValue(workStation);
      workStationRepository.save.mockResolvedValue({ ...workStation, Status: 'Disponible' });

      await expect(service.ReactiveMachine(101)).resolves.toBe(
        'El Equipo ha sido reactivado y ahora está disponible',
      );
    });

    it('Debe retornar un mensaje si la estación no está en mantenimiento', async () => {
      const workStation = { MachineNumber: 101, Status: 'Disponible' } as WorkStation;
      workStationRepository.findOne.mockResolvedValue(workStation);

      await expect(service.ReactiveMachine(101)).resolves.toBe(
        'El Equipo no está en mantenimiento, no se realizaron cambios',
      );
    });

    it('Debe retornar un mensaje si la estación no existe', async () => {
      workStationRepository.findOne.mockResolvedValue(null);

      await expect(service.ReactiveMachine(101)).resolves.toBe(
        'No se encontró un equipo con ese número',
      );
    });
  });
});
