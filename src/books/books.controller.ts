import { Body, Controller, Post } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './DTO/create-book.dto';
import { Book } from './book.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('books')
@Controller('books')
export class BooksController {

    constructor(private readonly booksService: BooksService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new book' })
    @ApiResponse({ status: 201, description: 'The book has been successfully created.' })
    create(@Body() createBookDto: CreateBookDto): Book{
      return this.booksService.create(createBookDto);
    }

}
