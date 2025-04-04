import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { mock, MockProxy } from 'jest-mock-extended';
import { CreateBookDto } from '../DTO/create-book.dto';
import { BooksService } from '../books.service';
import { Book } from '../book.entity';

describe('BooksService', () => {
  let service: BooksService;
  let bookRepository: MockProxy<Repository<Book>>;

  beforeEach(async () => {
    bookRepository = mock<Repository<Book>>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(Book),
          useValue: bookRepository,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addBook', () => {
    it('should add a book successfully', async () => {
      const createBookDto: CreateBookDto = {
        Title: 'Test Book',
        Author: 'Test Author',
        Editorial: 'Test Editorial',
        PublishedYear: 2022,
        ISBN: '123456789',
        ShelfCategory: 'Test Category',
        Cover: 'Test Cover',
        BookConditionRating: 8,
        signatureCode: 'SIG123',
        InscriptionCode: 'INS456',
        ReserveBook: true,
        Observations: 'Test Observations'
      };
      bookRepository.create.mockReturnValue(createBookDto as Book);
      bookRepository.save.mockResolvedValue(createBookDto as Book);

      await expect(service.addBook(createBookDto)).resolves.toEqual({ message: 'Éxito al añadir el libro' });
    });

    it('should throw an internal error if saving fails', async () => {
      bookRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.addBook({
        Title: 'Test Book',
        Author: 'Test Author',
        Editorial: 'Test Editorial',
        PublishedYear: 2022,
        ISBN: '123456789',
        ShelfCategory: 'Test Category',
        Cover: 'Test Cover',
        BookConditionRating: 8,
        signatureCode: 'SIG123',
        InscriptionCode: 'INS456',
        ReserveBook: true,
        Observations: 'Test Observations'
      } as any)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findById', () => {
    it('should return a book if found', async () => {
      const book = { BookCode: 1, Title: 'Test Book' } as Book;
      bookRepository.findOne.mockResolvedValue(book);
      await expect(service.findById(1)).resolves.toEqual(book);
    });

    it('should throw NotFoundException if book does not exist', async () => {
      bookRepository.findOne.mockResolvedValue(null);
      await expect(service.findById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('disableBook', () => {
    it('should disable a book successfully', async () => {
      const book = { BookCode: 1, Status: true } as Book;
      bookRepository.findOne.mockResolvedValue(book);
      bookRepository.save.mockResolvedValue({ ...book, Status: false });
      await expect(service.disableBook(1)).resolves.toEqual({ message: 'Libro dado de baja correctamente' });
    });

    it('should throw InternalServerErrorException with correct message if book does not exist', async () => {
      bookRepository.findOne.mockResolvedValue(null);
      await expect(service.disableBook(1)).rejects.toThrow(new InternalServerErrorException(`El libro con código 1 no fue encontrado`));


    });
  });
});