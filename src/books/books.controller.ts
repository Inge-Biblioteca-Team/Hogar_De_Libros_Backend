
import { Body, Controller, Get, HttpStatus, Param, Patch, Post, Put, Query, Res } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './DTO/create-book.dto';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateBookDto } from './DTO/update-book.dto';
import { PaginationDto } from './DTO/Pagination.dto';
import { Book } from './book.entity';

@ApiTags('books')
@Controller('books')
export class BooksController {

    constructor(private readonly booksService: BooksService) {}

  
    @Post()
    @ApiBody({ type: CreateBookDto })
    @ApiResponse({ status: 201, description: 'Create a new book', type: CreateBookDto })
    async addBook(@Body() createBookDto: CreateBookDto): Promise<CreateBookDto> {
      return this.booksService.addBook(createBookDto);
    }
    
    @Patch(':bookCode')
    @ApiOperation({  })
    async updatePartial(
      @Param('bookCode') bookCode: number,
      @Body() updateBookDto: UpdateBookDto,
    ) {
      return await this.booksService.update(bookCode, updateBookDto);
    }
  
    @Patch(':bookCode/disable')
  @ApiOperation({  })
  async disableBook(@Param('bookCode') bookCode: number) {
    return await this.booksService.disableBook(bookCode);
  }

  @Get()
  @ApiOperation({ })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Cantidad de libros por página' })
  @ApiResponse({ status: 200, description: 'Lista de libros paginada', type: [Book] })
  async findAll(@Query() paginationDto: PaginationDto) {
    return await this.booksService.findAll(paginationDto);
  }
}

