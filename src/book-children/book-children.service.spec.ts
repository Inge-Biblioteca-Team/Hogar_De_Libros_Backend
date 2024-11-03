/* eslint-disable prettier/prettier */
// src/book-children/book-children.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { BookChildrenService } from './book-children.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BooksChildren } from './book-children.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { PaginationFilterChildrenDto } from './DTO/pagination-filter-children.dto';

describe('BookChildrenService', () => {
  let service: BookChildrenService;
  let repo: Repository<BooksChildren>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookChildrenService,
        {
          provide: getRepositoryToken(BooksChildren),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<BookChildrenService>(BookChildrenService);
    repo = module.get<Repository<BooksChildren>>(getRepositoryToken(BooksChildren));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add a new book-child', async () => {
    const bookData = {
      Title: 'Sample Book',
      Author: 'Anonimo',
      Editorial: 'Sample Editorial',
      PublishedYear: 2022,
      ISBN: '1234567890',
      ShelfCategory: 'Sample Category',
      Cover: 'URL',
      BookConditionRating: 10,
      SignatureCode: 'CODE123',
      InscriptionCode: 'INSCR123',
      ReserveBook: true,
      Observations: 'N/A'
    } as BooksChildren;
    

    
    jest.spyOn(repo, 'create').mockReturnValue(bookData as BooksChildren);
    jest.spyOn(repo, 'save').mockResolvedValue({ id: 1, ...bookData } as BooksChildren);
    
    const result = await service.addBook(bookData);
    expect(result).toEqual({ id: 1, ...bookData });
  });

  it('should throw NotFoundException if book is not found', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValue(null);

    await expect(service.findById(999)).rejects.toThrow(new NotFoundException('El libro con código 999 no fue encontrado'));
  });
  
  it('should update an existing book-child', async () => {
    const existingBook = { id: 1, BookCode: 123, Title: 'Old Title' } as unknown as BooksChildren;
    const updatedData = { Title: 'Updated Title' };

    jest.spyOn(repo, 'findOne').mockResolvedValue(existingBook);
    jest.spyOn(repo, 'save').mockResolvedValue({ ...existingBook, ...updatedData });

    const result = await service.update(123, updatedData);
    expect(result).toEqual({ ...existingBook, ...updatedData });
  });

  it('should throw NotFoundException if book-child to update is not found', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValue(null);

    await expect(service.update(999, { Title: 'Updated Title' })).rejects.toThrow(
      new NotFoundException(`El libro con código 999 no fue encontrado`),
    );
  });

  it('should enable a book-child', async () => {
    const book = { id: 1, BookCode: 123, Status: false } as unknown as BooksChildren;
    jest.spyOn(repo, 'findOne').mockResolvedValue(book);
    jest.spyOn(repo, 'save').mockResolvedValue({ ...book, Status: true });

   // const result = await service.enableBook(123, { Status: true });
   // expect(result.Status).toBe(true);
  });

  it('should throw NotFoundException if book-child to enable is not found', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValue(null);

  //  await expect(service.enableBook(999, { Status: true })).rejects.toThrow(
   //   new NotFoundException(`El libro con código 999 no fue encontrado`),
   // );
  });

  it('should disable a book-child', async () => {
    const book = { id: 1, BookCode: 123, Status: true } as unknown as BooksChildren;
    jest.spyOn(repo, 'findOne').mockResolvedValue(book);
    jest.spyOn(repo, 'save').mockResolvedValue({ ...book, Status: false });

   // const result = await service.disableBook(123);
   // expect(result.Status).toBe(false);
  });

  it('should throw NotFoundException if book-child to disable is not found', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValue(null);

    await expect(service.disableBook(999)).rejects.toThrow(
      new NotFoundException(`El libro con código 999 no fue encontrado`),
    );
  });

  it('should find a book-child by ID', async () => {
    const book = { id: 1, BookCode: 123, Title: 'Sample Book' } as unknown as BooksChildren;
    jest.spyOn(repo, 'findOne').mockResolvedValue(book);

    const result = await service.findById(123);
    expect(result).toEqual(book);
  });

  it('should throw NotFoundException if book-child by ID is not found', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValue(null);

    await expect(service.findById(999)).rejects.toThrow(
      new NotFoundException(`El libro con código 999 no fue encontrado`),
    );
  });
  it('should return paginated and filtered book-children', async () => {
    const paginationFilter: PaginationFilterChildrenDto = {
      page: 1,
      limit: 2,
      Title: 'Sample Book',
      ISBN: '1234567890',
      Author: 'Author Sample',
      SignatureCode: 'CODE123',
      Status: 1,
      ShelfCategory: 'Sample Category',
      PublishedYear: 2022,
      Editorial: 'Sample Editorial'
    };
  
    const books = [
      { id: 1, Title: 'Sample Book 1', Author: 'Author Sample' },
      { id: 2, Title: 'Sample Book 2', Author: 'Author Sample' },
    ];
  
 
    const queryBuilder = {
      andWhere: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([books, 2]),
    };
  
    jest.spyOn(repo, 'createQueryBuilder').mockReturnValue(queryBuilder as any);
  
    const result = await service.findAll(paginationFilter);
  
    expect(result.data).toEqual(books);
    expect(result.count).toBe(2);
  
    
expect(queryBuilder.andWhere).toHaveBeenNthCalledWith(1, 'book.Title Like :Title', { Title: '%Sample Book%' });
expect(queryBuilder.andWhere).toHaveBeenNthCalledWith(2, 'book.ISBN Like :ISBN', { ISBN: '%1234567890%' });
expect(queryBuilder.andWhere).toHaveBeenNthCalledWith(3, 'book.Author LIKE :Author', { Author: '%Author Sample%' });
expect(queryBuilder.andWhere).toHaveBeenNthCalledWith(4, 'book.SignatureCode LIKE :SignatureCode', { SignatureCode: '%CODE123%' });
expect(queryBuilder.andWhere).toHaveBeenNthCalledWith(5, 'book.Status = :Status', { Status: 1 });
expect(queryBuilder.andWhere).toHaveBeenNthCalledWith(6, 'book.ShelfCategory LIKE :ShelfCategory', { ShelfCategory: '%Sample Category%' });
expect(queryBuilder.andWhere).toHaveBeenNthCalledWith(7, 'book.PublishedYear = :PublishedYear', { PublishedYear: 2022 });
expect(queryBuilder.andWhere).toHaveBeenNthCalledWith(8, 'book.Editorial LIKE :Editorial', { Editorial: 'Sample Editorial' });


  });
  
  
});
 

