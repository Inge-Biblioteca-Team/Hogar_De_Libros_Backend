/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';

import { Book } from './book.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateBookDto } from './DTO/update-book.dto';
import { PaginationFilterDto } from './DTO/pagination-filter.dto';
import { CreateBookDto } from './DTO/create-book.dto';
import { EnableBookDto } from './DTO/enable-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  async addBook(createBookDto: CreateBookDto): Promise<Book> {
    const newBook = this.bookRepository.create(createBookDto);
    return await this.bookRepository.save(newBook);
  }

  async update(bookCode: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.bookRepository.findOne({
      where: { BookCode: bookCode },
    });

    if (!book) {
      throw new NotFoundException(
        `El libro con código ${bookCode} no fue encontrado`,
      );
    }

    Object.assign(book, updateBookDto);

    return this.bookRepository.save(book);
  }
  async enableBook(
    bookCode: number,
    enableBookDto: EnableBookDto,
  ): Promise<Book> {
    const book = await this.bookRepository.findOne({
      where: { BookCode: bookCode },
    });

    if (!book) {
      throw new NotFoundException(
        `El libro con código ${bookCode} no fue encontrado`,
      );
    }

    book.Status = enableBookDto.Status;

    return await this.bookRepository.save(book);
  }
  async disableBook(bookCode: number): Promise<Book> {
    const book = await this.bookRepository.findOne({
      where: { BookCode: bookCode },
    });

    if (!book) {
      throw new NotFoundException(
        `El libro con código ${bookCode} no fue encontrado`,
      );
    }

    book.Status = false;
    return this.bookRepository.save(book);
  }

  async findById(BookCode: number): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { BookCode } });

    if (!book) {
      throw new NotFoundException(
        `El libro con código ${BookCode} no fue encontrado`,
      );
    }

    return book;
  }
  async findAll(
    PaginationFilterDto: PaginationFilterDto,
  ): Promise<{ data: Book[]; count: number }> {
    const {
      page = 1,
      limit = 10,
      Title,
      ISBN,
      Author,
      signatureCode,
      Status,
      ShelfCategory,
      PublishedYear,
      Editorial,
    } = PaginationFilterDto;

    const query = this.bookRepository.createQueryBuilder('book');

    if (Title) {
      query.andWhere('book.Title Like :Title', { Title: `%${Title}%` });
    }

    if (ISBN) {
      query.andWhere('book.ISBN Like :ISBN', { ISBN: `%${ISBN}%` });
    }

    if (Author) {
      query.andWhere('book.Author LIKE :Author', { Author: `%${Author}%` });
    }

    if (signatureCode) {
      query.andWhere('book.signatureCode LIKE :SignatureCode', {
        SignatureCode: `%${signatureCode}%`,
      });
    }

    if (Status !== undefined) {
      const statusValue = Status;
      query.andWhere('book.Status = :Status', { Status: statusValue });
    }
    if (ShelfCategory) {
      query.andWhere('book.ShelfCategory LIKE :ShelfCategory', {
        ShelfCategory: `%${ShelfCategory}%`,
      });
    }
    if (PublishedYear) {
      query.andWhere('book.PublishedYear = :PublishedYear', {
        PublishedYear,
      });
    }

    if (Editorial) {
      query.andWhere('book.Editorial LIKE :Editorial', {
        Editorial,
      });
    }
    query.skip((page - 1) * limit).take(limit);
    query.orderBy('book.bookCode', 'DESC');
    const [data, count] = await query.getManyAndCount();

    return {
      data,
      count,
    };
  }
}
