import { Test, TestingModule } from '@nestjs/testing';
import { CollaboratorService } from './collaborator.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Collaborator } from './collaborator.entity';
import { User } from 'src/user/user.entity';
import { NotesService } from 'src/notes/notes.service';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateCollaboratorDTO } from './DTO/create-collaborator-DTO';
import { DenyCollaboratorRequestDTO } from './DTO/deny-collaborator-DTO';
import { mock, MockProxy } from 'jest-mock-extended';

describe('CollaboratorService', () => {
  let service: CollaboratorService;
  let collaboratorRepository: MockProxy<Repository<Collaborator>>;
  let userRepository: MockProxy<Repository<User>>;
  let notesService: MockProxy<NotesService>;

  beforeEach(async () => {
    collaboratorRepository = mock<Repository<Collaborator>>();
    userRepository = mock<Repository<User>>();
    notesService = mock<NotesService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CollaboratorService,
        {
          provide: getRepositoryToken(Collaborator),
          useValue: collaboratorRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: userRepository,
        },
        {
          provide: NotesService,
          useValue: notesService,
        },
      ],
    }).compile();

    service = module.get<CollaboratorService>(CollaboratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('CreateCollaborator', () => {
    it('should create a collaborator successfully', async () => {
      const dto: CreateCollaboratorDTO = {
        UserFullName: 'Juan Perez',
        Entitycollaborator: 'MEP',
        UserCedula: '123456789',
        UserBirthDate: '2000-05-10',
        UserGender: 'Hombre',
        UserAddress: 'Calle 123',
        UserPhone: '987654321',
        UserEmail: 'juanperez@example.com',
        PrincipalCategory: 'Capacitación',
        SubCategory: 'Tecnología',
        ExtraInfo: 'Información extra',
        activityDate: new Date(),
        Description: 'Descripción de la actividad',
      };

      userRepository.findOne.mockResolvedValue(null);
      collaboratorRepository.create.mockReturnValue(dto as any);
      collaboratorRepository.save.mockResolvedValue(dto as any);
      notesService.createNote.mockResolvedValue(undefined);

      await expect(service.CreateCollaborator(dto, [])).resolves.toEqual({
        message: 'Solicitud de colaborador enviada correctamente.',
      });
    });

    it('should throw InternalServerErrorException if an error occurs', async () => {
      collaboratorRepository.save.mockRejectedValue(new Error('Database error'));
      await expect(service.CreateCollaborator({} as any, [])).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('denyCollaborator', () => {
    it('should deny a collaborator request successfully', async () => {
      const dto: DenyCollaboratorRequestDTO = { reason: 'No cumple requisitos', Id: 1 };
      const collaborator = { CollaboratorId: 1, Status: 'Pendiente', Reason: null } as Collaborator;

      collaboratorRepository.findOne.mockResolvedValue(collaborator);
      collaboratorRepository.save.mockResolvedValue({ ...collaborator, Status: 'Rechazado', Reason: dto.reason });

      await expect(service.denyCollaborator(1, dto)).resolves.toEqual({
        message: 'Solicitud de colaborador rechazada correctamente',
      });
    });

    it('should throw NotFoundException if collaborator is not found', async () => {
      collaboratorRepository.findOne.mockResolvedValue(null);
      await expect(service.denyCollaborator(1, { reason: 'No cumple requisitos', Id: 1 })).rejects.toThrow('Solicitud de colaborador no encontrada');
    });
  });
});
