import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './DTO/create-book.dto';
import { Book } from './book.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DisableBookDto } from './DTO/disable-book.dto';
import { UpdateBookDto } from './DTO/update-book.dto';
import { PaginationDto } from './DTO/Pagination.dto';

@Injectable()
export class BooksService {
    
    constructor(
      @InjectRepository(Book)
      private bookRepository: Repository<Book>
  ){}

  async addBook(createBookDto: CreateBookDto): Promise<Book> {
    const newBook = this.bookRepository.create(createBookDto);
    return await this.bookRepository.save(newBook);
  }
   
  async update(bookCode: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { BookCode: bookCode } });

    if (!book) {
      throw new NotFoundException(`El libro con código ${bookCode} no fue encontrado`);
    }

    Object.assign(book, updateBookDto);

    return this.bookRepository.save(book);
  }

  async disableBook(bookCode: number): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { BookCode: bookCode } });

    if (!book) {
      throw new NotFoundException(`El libro con código ${bookCode} no fue encontrado`);
    }

    book.Status = false;
    return this.bookRepository.save(book);
  }
  async findAll(paginationDto: PaginationDto): Promise<{ data: Book[], count: number }> {
    const { page = 1, limit = 10 } = paginationDto;

    const [data, count] = await this.bookRepository.findAndCount({
      where: { Status: true },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data,
      count,
    };
  }

    }


