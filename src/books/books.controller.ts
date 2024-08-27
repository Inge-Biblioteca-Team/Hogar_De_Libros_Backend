
import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './DTO/create-book.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateBookDto } from './DTO/update-book.dto';
import { Book } from './book.entity';
import { PaginationFilterDto } from './DTO/pagination-filter.dto';


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
  @ApiOperation({ summary: 'Obtener libros con paginación y filtros' })
  @ApiResponse({ status: 200, description: 'Lista de libros paginada y filtrada', type: [Book] })
  @ApiResponse({ status: 400, description: 'Parámetros inválidos' })
  async findAll(@Query() paginationFilterDto: PaginationFilterDto) {
    return await this.booksService.findAll(paginationFilterDto);
  }
}


