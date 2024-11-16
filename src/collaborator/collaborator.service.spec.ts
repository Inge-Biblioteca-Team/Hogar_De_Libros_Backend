import { Test, TestingModule } from '@nestjs/testing';
import { CollaboratorService } from './collaborator.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Collaborator } from './collaborator.entity';
import { User } from 'src/user/user.entity';
import { NotesService } from 'src/notes/notes.service';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { DenyCollaboratorRequestDTO } from './DTO/deny-collaborator-DTO';

describe('CollaboratorService', () => {
  let service: CollaboratorService;
  let collaboratorRepository: Repository<Collaborator>;

  const mockCollaboratorRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CollaboratorService,
        {
          provide: getRepositoryToken(Collaborator),
          useValue: mockCollaboratorRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
        {
          provide: NotesService,
          useValue: { createNote: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<CollaboratorService>(CollaboratorService);
    collaboratorRepository = module.get<Repository<Collaborator>>(getRepositoryToken(Collaborator));
  });

  describe('denyCollaborator', () => {
    it('should deny a collaborator with a reason', async () => {
      const collaborator = { CollaboratorId: 1, Status: 'Pendiente' };
      const dto: DenyCollaboratorRequestDTO = {
        reason: 'Falta de experiencia',
        Id: 1,
      };

      mockCollaboratorRepository.findOne.mockResolvedValue(collaborator);
      mockCollaboratorRepository.save.mockResolvedValue({
        ...collaborator,
        Status: 'Rechazado',
        Reason: dto.reason,
      });

      const result = await service.denyCollaborator(1, dto);
      expect(result).toEqual({ message: 'Solicitud de colaborador rechazada correctamente' });
      expect(mockCollaboratorRepository.save).toHaveBeenCalledWith({
        ...collaborator,
        Status: 'Rechazado',
        Reason: dto.reason,
      });
    });

    it('should throw NotFoundException if collaborator is not found', async () => {
      mockCollaboratorRepository.findOne.mockResolvedValue(null);
      const dto: DenyCollaboratorRequestDTO = { reason: 'Incompatibilidad de horario', Id: 1 };

      await expect(service.denyCollaborator(1, dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('CancelCollaborator', () => {
    it('should cancel a collaborator request', async () => {
      const collaborator = { CollaboratorId: 1, Status: 'Pendiente' };
      const dto: DenyCollaboratorRequestDTO = {
        reason: 'Cambio de planes',
        Id: 1,
      };

      mockCollaboratorRepository.findOne.mockResolvedValue(collaborator);
      mockCollaboratorRepository.save.mockResolvedValue({
        ...collaborator,
        Status: 'Cancelado',
        Reason: dto.reason,
      });

      const result = await service.CancelCollaborator(1, dto);
      expect(result).toEqual({ message: 'Solicitud de colaborador cancelada correctamente' });
      expect(mockCollaboratorRepository.save).toHaveBeenCalledWith({
        ...collaborator,
        Status: 'Cancelado',
        Reason: dto.reason,
      });
    });

    it('should throw NotFoundException if collaborator is not found for cancel', async () => {
      mockCollaboratorRepository.findOne.mockResolvedValue(null);
      const dto: DenyCollaboratorRequestDTO = { reason: 'No cumple con los requisitos', Id: 1 };

      await expect(service.CancelCollaborator(1, dto)).rejects.toThrow(NotFoundException);
    });
  });
});
