import { Test, TestingModule } from '@nestjs/testing';
import { NotesService } from './notes.service';
import { Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';

const mockNoteRepository = {
  createQueryBuilder: jest.fn().mockReturnValue({
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    whereInIds: jest.fn().mockReturnThis(),
    execute: jest.fn(),
    delete: jest.fn().mockReturnThis(),
  }),
  create: jest.fn(),
  save: jest.fn(),
};

describe('NotesService', () => {
  let service: NotesService;
  let noteRepository: Repository<Note>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        { provide: getRepositoryToken(Note), useValue: mockNoteRepository },
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
    noteRepository = module.get<Repository<Note>>(getRepositoryToken(Note));
  });

  describe('getPendingNotes', () => {
    it('should return pending notes', async () => {
      const result = await service.getPendingNotes();
      expect(result).toEqual({ data: [], count: 0 });
    });
  });

  describe('markAsRead', () => {
    it('should mark a note as read', async () => {
      mockNoteRepository.createQueryBuilder().execute.mockResolvedValue({});
      const result = await service.markAsRead(1);
      expect(result).toEqual({ message: 'Exito' });
    });

    it('should throw InternalServerErrorException on failure', async () => {
      mockNoteRepository.createQueryBuilder().execute.mockRejectedValue(new Error('Error'));
      await expect(service.markAsRead(1)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('moveToTrash', () => {
    it('should move a note to trash', async () => {
      mockNoteRepository.createQueryBuilder().execute.mockResolvedValue({});
      const result = await service.moveToTras(1);
      expect(result).toEqual({ message: 'Exito' });
    });
  });

  describe('createNote', () => {
    it('should create a new note', async () => {
      const dto: CreateNoteDto = {message:'Agua Potable', type:'Aviso'};
      mockNoteRepository.create.mockReturnValue(dto);
      mockNoteRepository.save.mockResolvedValue(dto);
      const result = await service.createNote(dto);
      expect(result).toEqual({ message: 'Exito' });
    });
  });
});
