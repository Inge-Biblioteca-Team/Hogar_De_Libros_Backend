/* eslint-disable prettier/prettier */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { Book } from './book.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateBookDto } from './DTO/update-book.dto';
import { PaginationFilterDto } from './DTO/pagination-filter.dto';
import { CreateBookDto } from './DTO/create-book.dto';
import { EnableBookDto } from './DTO/enable-book.dto';
import { OpacFiltroDto } from './DTO/opac-filtro.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  async addBook(createBookDto: CreateBookDto): Promise<{ message: string }> {

    try {
      const newBook = this.bookRepository.create(createBookDto);
      await this.bookRepository.save(newBook);
      return { message: 'Éxito al añadir el libro' };
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async update(
    bookCode: number,
    updateBookDto: UpdateBookDto,
  ): Promise<{ message: string }> {
    try {
      const book = await this.bookRepository.findOne({
        where: { BookCode: bookCode },
      });
      if (!book) {
        throw new NotFoundException(
          `El libro con código ${bookCode} no fue encontrado`,
        );
      }
      Object.assign(book, updateBookDto);
      await this.bookRepository.save(book);

      return { message: 'Éxito al editar el libro' };
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error durante la edición';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async enableBook(
    bookCode: number,
    enableBookDto: EnableBookDto,
  ): Promise<{ message: string }> {
    try {
      const book = await this.bookRepository.findOne({
        where: { BookCode: bookCode },
      });

      if (!book) {
        throw new NotFoundException(
          `El libro con código ${bookCode} no fue encontrado`,
        );
      }
      book.Status = enableBookDto.Status;
      await this.bookRepository.save(book);

      return;
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async disableBook(bookCode: number): Promise<{ message: string }> {
    try {
      const book = await this.bookRepository.findOne({
        where: { BookCode: bookCode },
      });

      if (!book) {
        throw new NotFoundException(
          `El libro con código ${bookCode} no fue encontrado`,
        );
      }
      book.Status = false;
       await this.bookRepository.save(book);
      return { message: 'Libro dado de baja correctamente' };
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new InternalServerErrorException(errorMessage);
    }
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

  async getCategoriesNames(): Promise<string[]> {
    const categories = await this.bookRepository
      .createQueryBuilder('book')
      .select('DISTINCT book.ShelfCategory', 'category')
      .orderBy('book.ShelfCategory', 'ASC')
      .getRawMany();
    return categories.map((c) => c.category);
  }

  async getColecction(
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

    query.andWhere(
      `book.BookCode NOT IN (
        SELECT loan.bookBookCode 
        FROM book_loans loan 
        WHERE loan.Status IN (:...statuses)
      )`,
      { statuses: ['Pendiente', 'En progreso'] },
    );

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

  async opacFiltro(filterDto: OpacFiltroDto): Promise<{ data: Book[]; total: number; page: number; limit: number }> {
    console.log('DTO recibido en el servicio:', filterDto);
  
    const { title, shelfCategory, author, publishedYear, page = 1, limit = 10 } = filterDto;
  
    const query = this.bookRepository.createQueryBuilder('book');
  
    if (title?.trim()) {
      query.andWhere('LOWER(book.Title) LIKE LOWER(:title)', {
        title: `%${title.trim()}%`,
      });
    }
  
    if (shelfCategory?.trim()) {
      query.andWhere('LOWER(book.ShelfCategory) LIKE LOWER(:shelfCategory)', {
        shelfCategory: `%${shelfCategory.trim()}%`,
      });
    }
  
    if (author?.trim()) {
      query.andWhere('LOWER(book.Author) LIKE LOWER(:author)', {
        author: `%${author.trim()}%`,
      });
    }
  
    if (publishedYear) {
      query.andWhere('book.PublishedYear = :publishedYear', { publishedYear });
    }
  
    const total = await query.getCount(); // Obtener el número total de registros
    const result = await query
      .take(limit)
      .skip((page - 1) * limit)
      .getMany();
  
    return {
      data: result,
      total,
      page,
      limit,
    };
  }
}
