
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { EnableBookDto } from './dto/enable-book.dto';
import { PaginationFilterDto } from './dto/pagination-filter.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

 
  async addBook(createBookDto: CreateBookDto): Promise<Book> {
    
    const existingBook = await this.bookRepository.findOne({
      where: [
        { ISBN: createBookDto.ISBN },
        { InscriptionCode: createBookDto.InscriptionCode },
      ],
    });

    if (existingBook) {
      throw new BadRequestException(
        `El libro con ISBN ${createBookDto.ISBN} o código de inscripción ${createBookDto.InscriptionCode} ya existe.`,
      );
    }

    

    const newBook = this.bookRepository.create(createBookDto);
    return await this.bookRepository.save(newBook);
  }

  async update(bookCode: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.bookRepository.findOne({
      where: { BookCode: bookCode },
    });

    if (!book) {
      throw new NotFoundException(`El libro con código ${bookCode} no fue encontrado.`);
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
      throw new NotFoundException(`El libro con código ${bookCode} no fue encontrado.`);
    }

    
    if (typeof enableBookDto.Status !== 'boolean') {
      throw new BadRequestException('El estado debe ser verdadero o falso.');
    }

    book.Status = enableBookDto.Status;

    return await this.bookRepository.save(book);
  }

  async disableBook(bookCode: number): Promise<Book> {
    const book = await this.bookRepository.findOne({
      where: { BookCode: bookCode },
    });

    if (!book) {
      throw new NotFoundException(`El libro con código ${bookCode} no fue encontrado.`);
    }

    book.Status = false;
    return this.bookRepository.save(book);
  }


  async findById(BookCode: number): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { BookCode } });

    if (!book) {
      throw new NotFoundException(`El libro con código ${BookCode} no fue encontrado.`);
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
      query.andWhere('book.SignatureCode LIKE :SignatureCode', {
        SignatureCode: `%${signatureCode}%`,
      });
    }

    if (Status !== undefined) {
      query.andWhere('book.Status = :Status', { Status });
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
    query.orderBy('book.BookCode', 'DESC');
    const [data, count] = await query.getManyAndCount();

    return {
      data,
      count,
    };
  }
}
