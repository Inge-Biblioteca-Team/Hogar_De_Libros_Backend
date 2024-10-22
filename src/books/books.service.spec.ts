import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { EnableBookDto } from './dto/enable-book.dto';
import { PaginationFilterDto } from './dto/pagination-filter.dto';

describe('BooksService', () => {
  let service: BooksService;
  let bookRepository: Repository<Book>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(Book),
          useClass: Repository, // Simulamos el repositorio
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    bookRepository = module.get<Repository<Book>>(getRepositoryToken(Book));
  });

  describe('addBook', () => {
    it('should throw BadRequestException if a book with the same ISBN or InscriptionCode exists', async () => {
      const createBookDto: CreateBookDto = {
        Title: 'Test Book',
        Author: 'Test Author',
        Editorial: 'Test Editorial',
        PublishedYear: 2021,
        ISBN: '1234567890123',
        ShelfCategory: 'Science',
        Cover: 'URL',
        BookConditionRating: 9,
        signatureCode: 'ABC123',
        InscriptionCode: '12345',
        ReserveBook: false,
        Observations: 'Test',
      };

      // Simulamos que el libro ya existe en la base de datos
      jest.spyOn(bookRepository, 'findOne').mockResolvedValue({} as Book);

      await expect(service.addBook(createBookDto)).rejects.toThrow(BadRequestException);
    });

    it('should save a new book successfully', async () => {
      const createBookDto: CreateBookDto = {
        Title: 'Test Book',
        Author: 'Test Author',
        Editorial: 'Test Editorial',
        PublishedYear: 2021,
        ISBN: '1234567890123',
        ShelfCategory: 'Science',
        Cover: 'URL',
        BookConditionRating: 9,
        signatureCode: 'ABC123',
        InscriptionCode: '12345',
        ReserveBook: false,
        Observations: 'Test',
      };

      // Simulamos que el libro no existe y se puede crear
      jest.spyOn(bookRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(bookRepository, 'create').mockReturnValue(createBookDto as any);
      jest.spyOn(bookRepository, 'save').mockResolvedValue(createBookDto as any);

      const result = await service.addBook(createBookDto);
      expect(result).toEqual(createBookDto);
      expect(bookRepository.save).toHaveBeenCalledWith(createBookDto);
    });
  });

  describe('update', () => {
    it('should throw NotFoundException if the book does not exist', async () => {
      const updateBookDto: UpdateBookDto = { Title: 'Updated Title' };

      // Simulamos que el libro no se encuentra en la base de datos
      jest.spyOn(bookRepository, 'findOne').mockResolvedValue(null);

      await expect(service.update(123, updateBookDto)).rejects.toThrow(NotFoundException);
    });

    it('should update the book successfully', async () => {
      const updateBookDto: UpdateBookDto = { Title: 'Updated Title' };
      const existingBook = { BookCode: 123 } as Book;

      // Simulamos la existencia del libro y que se pueda actualizar
      jest.spyOn(bookRepository, 'findOne').mockResolvedValue(existingBook);
      jest.spyOn(bookRepository, 'save').mockResolvedValue(existingBook);

      const result = await service.update(123, updateBookDto);
      expect(result).toEqual(existingBook);
      expect(bookRepository.save).toHaveBeenCalledWith(existingBook);
    });
  });

  describe('enableBook', () => {
    it('should throw NotFoundException if the book does not exist', async () => {
      const enableBookDto: EnableBookDto = { Status: true };

      // Simulamos que el libro no se encuentra en la base de datos
      jest.spyOn(bookRepository, 'findOne').mockResolvedValue(null);

      await expect(service.enableBook(123, enableBookDto)).rejects.toThrow(NotFoundException);
    });

    it('should update the book status successfully', async () => {
      const enableBookDto: EnableBookDto = { Status: true };
      const existingBook = { BookCode: 123, Status: false } as Book;

      // Simulamos que el libro existe y se puede habilitar
      jest.spyOn(bookRepository, 'findOne').mockResolvedValue(existingBook);
      jest.spyOn(bookRepository, 'save').mockResolvedValue(existingBook);

      const result = await service.enableBook(123, enableBookDto);
      expect(result.Status).toBe(true);
      expect(bookRepository.save).toHaveBeenCalledWith(existingBook);
    });
  });

  describe('disableBook', () => {
    it('should throw NotFoundException if the book does not exist', async () => {
      // Simulamos que el libro no se encuentra en la base de datos
      jest.spyOn(bookRepository, 'findOne').mockResolvedValue(null);

      await expect(service.disableBook(123)).rejects.toThrow(NotFoundException);
    });

    it('should disable the book successfully', async () => {
      const existingBook = { BookCode: 123, Status: true } as Book;

      // Simulamos que el libro existe y se puede deshabilitar
      jest.spyOn(bookRepository, 'findOne').mockResolvedValue(existingBook);
      jest.spyOn(bookRepository, 'save').mockResolvedValue(existingBook);

      const result = await service.disableBook(123);
      expect(result.Status).toBe(false);
      expect(bookRepository.save).toHaveBeenCalledWith(existingBook);
    });
  });

  describe('findById', () => {
    it('should throw NotFoundException if the book is not found', async () => {
      // Simulamos que el libro no se encuentra en la base de datos
      jest.spyOn(bookRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findById(123)).rejects.toThrow(NotFoundException);
    });

    it('should return a book if found', async () => {
      const existingBook = { BookCode: 123 } as Book;

      // Simulamos que el libro existe
      jest.spyOn(bookRepository, 'findOne').mockResolvedValue(existingBook);

      const result = await service.findById(123);
      expect(result).toEqual(existingBook);
    });
  });

  describe('findAll', () => {
    it('should return books with pagination and filters', async () => {
      const paginationFilterDto: PaginationFilterDto = { page: 1,
        limit: 10,
        Title: 'Test Title',
        ISBN: '1234567890123',
        Author: 'Test Author',
        signatureCode: 'ABC123',
        Status: 1,
        ShelfCategory: 'Literature',
        PublishedYear: 2021,
        Editorial: 'Test Editorial',};

      const books: Book[] = [{ BookCode: 123, Title: 'Test Book' } as Book];
      const totalBooks = 1;

      // Simulamos el comportamiento de `createQueryBuilder` para los filtros y la paginación
      jest.spyOn(bookRepository, 'createQueryBuilder').mockImplementation(() => ({
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([books, totalBooks]),
      }) as any);

      const result = await service.findAll(paginationFilterDto);
      expect(result).toEqual({ data: books, count: totalBooks });
    });
  });
});
