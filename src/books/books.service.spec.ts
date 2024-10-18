import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './DTO/create-book.dto';
import { UpdateBookDto } from './DTO/update-book.dto';
import { EnableBookDto } from './DTO/enable-book.dto';

describe('BooksService', () => {
  let service: BooksService;
  let repository: Repository<Book>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(Book),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    repository = module.get<Repository<Book>>(getRepositoryToken(Book));
  });

  describe('addBook', () => {
    it('should add a book successfully', async () => {
      const createBookDto: CreateBookDto = {   Title: 'Lazarillo de Tormes',
        Author: 'Anonimo',
        Editorial: 'Editorial Universitaria Centroamericana Educa',
        PublishedYear: 1997,
        ISBN: '9977-30-347-9',
        ShelfCategory: 'Obras Literarias',
        Cover: 'URL o Direccion Local',
        BookConditionRating: 8,
        signatureCode: 'Sig001',
        InscriptionCode: '683251',
        ReserveBook: true,
        Observations: 'N/A',};
      const savedBook = { ...createBookDto, BookCode: 1 } as Book;

      jest.spyOn(repository, 'create').mockReturnValue(savedBook);
      jest.spyOn(repository, 'save').mockResolvedValue(savedBook);

      const result = await service.addBook(createBookDto);
      expect(result).toEqual(savedBook);
      expect(repository.create).toHaveBeenCalledWith(createBookDto);
      expect(repository.save).toHaveBeenCalledWith(savedBook);
    });
  });

  describe('update', () => {
    it('should update a book successfully', async () => {
      const bookCode = 1;
      const updateBookDto: UpdateBookDto = { /* propiedades del DTO aquí */ };
      const book = { BookCode: bookCode } as Book;
      const updatedBook = { ...book, ...updateBookDto };

      jest.spyOn(repository, 'findOne').mockResolvedValue(book);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedBook);

      const result = await service.update(bookCode, updateBookDto);
      expect(result).toEqual(updatedBook);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { BookCode: bookCode } });
      expect(repository.save).toHaveBeenCalledWith(updatedBook);
    });

    it('should throw NotFoundException if book is not found', async () => {
      const bookCode = 999;
      const updateBookDto: UpdateBookDto = { /* propiedades del DTO aquí */ };

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.update(bookCode, updateBookDto)).rejects.toThrow(
        new NotFoundException(`El libro con código ${bookCode} no fue encontrado`)
      );
    });
  });

  describe('enableBook', () => {
    it('should enable a book successfully', async () => {
      const bookCode = 1;
      const enableBookDto: EnableBookDto = { Status: true };
      const book = { BookCode: bookCode, Status: false } as Book;
      const enabledBook = { ...book, Status: true };

      jest.spyOn(repository, 'findOne').mockResolvedValue(book);
      jest.spyOn(repository, 'save').mockResolvedValue(enabledBook);

      const result = await service.enableBook(bookCode, enableBookDto);
      expect(result).toEqual(enabledBook);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { BookCode: bookCode } });
      expect(repository.save).toHaveBeenCalledWith(enabledBook);
    });
  });

  describe('disableBook', () => {
    it('should disable a book successfully', async () => {
      const bookCode = 1;
      const book = { BookCode: bookCode, Status: true } as Book;
      const disabledBook = { ...book, Status: false };

      jest.spyOn(repository, 'findOne').mockResolvedValue(book);
      jest.spyOn(repository, 'save').mockResolvedValue(disabledBook);

      const result = await service.disableBook(bookCode);
      expect(result).toEqual(disabledBook);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { BookCode: bookCode } });
      expect(repository.save).toHaveBeenCalledWith(disabledBook);
    });
  });

  describe('findById', () => {
    it('should return a book if found', async () => {
      const bookCode = 1;
      const book = { BookCode: bookCode } as Book;

      jest.spyOn(repository, 'findOne').mockResolvedValue(book);

      const result = await service.findById(bookCode);
      expect(result).toEqual(book);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { BookCode: bookCode } });
    });

    it('should throw NotFoundException if book is not found', async () => {
      const bookCode = 999;

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findById(bookCode)).rejects.toThrow(
        new NotFoundException(`El libro con código ${bookCode} no fue encontrado`)
      );
    });
  });
});
