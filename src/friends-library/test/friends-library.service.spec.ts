import { Test, TestingModule } from '@nestjs/testing';
import { FriendsLibraryService } from './friends-library.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FriendsLibrary } from './friend-library.entity';
import { User } from 'src/user/user.entity';
import { NotesService } from 'src/notes/notes.service';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { DenyFriendRequestDTO } from './DTO/deny-friend-library.Dto';
import { UpdateFriendDTO } from './DTO/update-friend-library-DTO';
import { CreateFriendDTO } from './DTO/create-friend-library-DTO';

const mockFriendRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
  }),
};

const mockUserRepository = {
  findOne: jest.fn(),
};

const mockNotesService = {
  createNote: jest.fn(),
};

describe('FriendsLibraryService', () => {
  let service: FriendsLibraryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FriendsLibraryService,
        {
          provide: getRepositoryToken(FriendsLibrary),
          useValue: mockFriendRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: NotesService,
          useValue: mockNotesService,
        },
      ],
    }).compile();

    service = module.get<FriendsLibraryService>(FriendsLibraryService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('CreateFriend', () => {
    it('debería crear un amigo correctamente', async () => {
      const dto: CreateFriendDTO = {
        UserFullName: 'John Doe',
        UserCedula: '123456789',
        UserEmail:'john@gmail.com',
        UserPhone:'123456',
        UserBirthDate: '2000-01-01',
        UserGender: 'Male',
        UserAddress: 'Some address',
        SubCategory: 'Some category', // <-- Agregar este campo
      };
      const documents = [{ filename: 'doc1.pdf' } as Express.Multer.File];
      process.env.BASE_URL = 'http://localhost';
      mockFriendRepository.create.mockReturnValue(dto);
      mockFriendRepository.save.mockResolvedValue(dto);
      mockNotesService.createNote.mockResolvedValue(undefined);

      const result = await service.CreateFriend(dto, documents);
      expect(result).toEqual({ message: 'Solicitud de amigo enviada correctamente.' });
    });
  });

  describe('aproveFriendLibrary', () => {
    it('debería aprobar una solicitud de amigo', async () => {
      const friend = { FriendId: 1, Status: 'Pendiente' } as FriendsLibrary;
      mockFriendRepository.findOne.mockResolvedValue(friend);
      mockFriendRepository.save.mockResolvedValue({ ...friend, Status: 'Aprobado' });

      const result = await service.aproveFriendLibrary(1);
      expect(result).toEqual({ message: 'Solicitud de amigo aprobada correctamente' });
    });
  });

  describe('denyFriendLibrary', () => {
    it('debería rechazar una solicitud de amigo', async () => {
      const dto: DenyFriendRequestDTO = { Id:1,reason: 'No cumple requisitos' };
      const friend = { FriendId: 1, Status: 'Pendiente' } as FriendsLibrary;
      mockFriendRepository.findOne.mockResolvedValue(friend);
      mockFriendRepository.save.mockResolvedValue({ ...friend, Status: 'Rechazado', Reason: dto.reason });

      const result = await service.denyFriendLibrary(1, dto);
      expect(result).toEqual({ message: 'Solicitud de amigo rechazada correctamente' });
    });
  });

  describe('downFriendLibrary', () => {
    it('debería dar de baja un amigo', async () => {
      const dto: DenyFriendRequestDTO = { Id:1,reason: 'No cumple requisitos' };
      const friend = { FriendId: 1, Status: 'Aprobado' } as FriendsLibrary;
      mockFriendRepository.findOne.mockResolvedValue(friend);
      mockFriendRepository.save.mockResolvedValue({ ...friend, Status: 'Baja', Reason: dto.reason });

      const result = await service.downFriendLibrary(1, dto);
      expect(result).toEqual({ message: 'Amigo dado de baja correctamente' });
    });
  });

  describe('editFriendLibrary', () => {
    it('debería editar un amigo', async () => {
      const dto: UpdateFriendDTO = { PrincipalCategory: 'Educación' };
      const friend = { FriendId: 1, Status: 'Aprobado', PrincipalCategory: 'Voluntariado' } as FriendsLibrary;
      mockFriendRepository.findOne.mockResolvedValue(friend);
      mockFriendRepository.save.mockResolvedValue({ ...friend, ...dto });

      const result = await service.editFriendLibrary(1, dto);
      expect(result).toEqual({ message: 'Amigo dado de baja correctamente' });
    });
  });

  describe('getAllFriends', () => {
    it('debería retornar una lista de amigos con paginación', async () => {
      const filterDTO = { page: 1, limit: 10 };
      mockFriendRepository.createQueryBuilder().getManyAndCount.mockResolvedValue([[{}], 1]);
      const result = await service.getAllFriends(filterDTO);
      expect(result).toEqual({ data: [{}], count: 1 });
    });
  });
});