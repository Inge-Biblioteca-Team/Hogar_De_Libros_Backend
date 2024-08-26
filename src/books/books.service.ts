import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './DTO/create-book.dto';
import { Book } from './book.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BooksService {
    
    constructor(
      @InjectRepository(Book)
      private bookRepository: Repository<Book>
  ){}

  async createBook(createBookDto: CreateBookDto): Promise<Book> {
    const newBook = this.bookRepository.create(createBookDto);
    return await this.bookRepository.save(newBook);
  }

    }


