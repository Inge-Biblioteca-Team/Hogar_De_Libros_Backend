
import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './DTO/create-book.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Book } from './book.entity';

@ApiTags('books')
@Controller('books')
export class BooksController {

    constructor(private readonly booksService: BooksService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new book' })
    @ApiResponse({ status: 201, description: 'The book has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createBookDto: CreateBookDto): Promise<Book> {
    return this.booksService.createBook(createBookDto);
  }
}

