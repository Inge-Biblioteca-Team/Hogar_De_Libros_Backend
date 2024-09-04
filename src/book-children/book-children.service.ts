import { Injectable, NotFoundException } from '@nestjs/common';
import { BooksChildren } from './book-children.entity';
import { Repository } from 'typeorm';
import { CreateBookChildrenDto } from './DTO/create-book-children.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateBookChildrenDto } from './DTO/update-book-children.dto';
import { EnableBookChildrenDto } from './DTO/enable-book-children.dto';
import { PaginationFilterChildrenDto } from './DTO/pagination-filter-children.dto';

@Injectable()
export class BookChildrenService {
    constructor(
        @InjectRepository(BooksChildren)
        private bookChildrenRepository: Repository<BooksChildren>,
      ) {}
    
      async addBook(createBookChildrenDto: CreateBookChildrenDto): Promise<BooksChildren> {
        const newBook = this.bookChildrenRepository.create(createBookChildrenDto);
        return await this.bookChildrenRepository.save(newBook);
      }
    
      async update(bookCode: number, updateBookChildrenDto: UpdateBookChildrenDto): Promise<BooksChildren> {
        const book = await this.bookChildrenRepository.findOne({
          where: { BookCode: bookCode },
        });
    
        if (!book) {
          throw new NotFoundException(
            `El libro con código ${bookCode} no fue encontrado`,
          );
        }
    
        Object.assign(book, updateBookChildrenDto);
    
        return this.bookChildrenRepository.save(book);
      }
      async enableBook(
        bookCode: number,
        enableBookChildrenDto: EnableBookChildrenDto,
      ): Promise<BooksChildren> {
        const book = await this.bookChildrenRepository.findOne({
          where: { BookCode: bookCode },
        });
    
        if (!book) {
          throw new NotFoundException(
            `El libro con código ${bookCode} no fue encontrado`,
          );
        }
    
        book.Status = enableBookChildrenDto.Status;
    
        return await this.bookChildrenRepository.save(book);
      }
      async disableBook(bookCode: number): Promise<BooksChildren> {
        const book = await this.bookChildrenRepository.findOne({
          where: { BookCode: bookCode },
        });
    
        if (!book) {
          throw new NotFoundException(
            `El libro con código ${bookCode} no fue encontrado`,
          );
        }
    
        book.Status = false;
        return this.bookChildrenRepository.save(book);
      }
    
      async findById(BookCode: number): Promise<BooksChildren> {
        const book = await this.bookChildrenRepository.findOne({ where: { BookCode } });
    
        if (!book) {
          throw new NotFoundException(
            `El libro con código ${BookCode} no fue encontrado`,
          );
        }
    
        return book;
      }
      async findAll(
        PaginationFilterDto: PaginationFilterChildrenDto,
      ): Promise<{ data: BooksChildren[]; count: number }> {
        const {
          page = 1,
          limit = 10,
          Title,
          ISBN,
          Author,
          SignatureCode,
          Status,
          ShelfCategory,
          PublishedYear,
          Editorial,
        } = PaginationFilterDto;
    
        const query = this.bookChildrenRepository.createQueryBuilder('book');
    
        if (Title) {
          query.andWhere('book.Title Like :Title', { Title: `%${Title}%` });
        }
    
        if (ISBN) {
          query.andWhere('book.ISBN Like :ISBN', { ISBN: `%${ISBN}%` });
        }
    
        if (Author) {
          query.andWhere('book.Author LIKE :Author', { Author: `%${Author}%` });
        }
    
        if (SignatureCode) {
          query.andWhere('book.SignatureCode LIKE :SignatureCode', {
            SignatureCode: `%${SignatureCode}%`,
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
