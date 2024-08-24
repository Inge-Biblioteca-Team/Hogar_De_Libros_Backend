import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './DTO/create-book.dto';
import { Book } from './book.entity';

@Injectable()
export class BooksService {
    private books: Book[] = [];

    create(book: Book): Book {
        this.books.push(book);
        return book;
      }

    }


