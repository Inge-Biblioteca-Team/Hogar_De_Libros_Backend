import { Injectable, NotFoundException } from '@nestjs/common';

import { Book } from './book.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateBookDto } from './DTO/update-book.dto';
import { PaginationFilterDto } from './DTO/pagination-filter.dto';
import { CreateBookDto } from './DTO/create-book.dto';

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

  async findAll(
    PaginationFilterDto: PaginationFilterDto,
  ): Promise<{ data: Book[]; count: number }> {
    const {
      page = 1,
      limit = 10,
      ISBN,
      Author,
      SignatureCode,
      Status,
    } = PaginationFilterDto;

    const query = this.bookRepository.createQueryBuilder('book');

    if (ISBN) {
      query.andWhere('book.ISBN = :ISBN', { ISBN });
    }

    if (Author) {
      query.andWhere('book.Author LIKE :Author', { Author: `%${Author}%` });
    }

    if (SignatureCode) {
      query.andWhere('book.SignatureCode = :SignatureCode', { SignatureCode });
    }

    if (Status !== undefined) {
      const statusValue = Status === 'true' ? 1 : 0;
      query.andWhere('book.Status = :Status', { Status: statusValue });
    }

    query.skip((page - 1) * limit).take(limit);

    const [data, count] = await query.getManyAndCount();

    return {
      data,
      count,
    };
  }
}
