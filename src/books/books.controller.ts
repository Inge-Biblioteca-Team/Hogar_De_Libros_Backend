/* eslint-disable prettier/prettier */


import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './DTO/create-book.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateBookDto } from './DTO/update-book.dto';
import { Book } from './book.entity';
import { PaginationFilterDto } from './DTO/pagination-filter.dto';
import { EnableBookDto } from './DTO/enable-book.dto';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @ApiBody({ type: CreateBookDto })
  @ApiResponse({
    status: 201,
    description: 'Create a new book',
    type: CreateBookDto,
  })
  async addBook(@Body() createBookDto: CreateBookDto): Promise<CreateBookDto> {
    return this.booksService.addBook(createBookDto);
  }

  @Patch(':bookCode')
  @ApiOperation({})
  async updatePartial(
    @Param('bookCode') bookCode: number,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return await this.booksService.update(bookCode, updateBookDto);
  }

  @Put(':bookCode/enable')
  @ApiOperation({})
  @ApiParam({
    name: 'bookCode',
    type: Number,
    description: 'Código del libro a habilitar',
  })
  @ApiBody({ type: EnableBookDto })
  @ApiResponse({
    status: 200,
    description: 'Libro habilitado exitosamente',
    type: Book,
  })
  @ApiResponse({ status: 404, description: 'Libro no encontrado' })
  async enableBook(
    @Param('bookCode') bookCode: number,
    @Body() enableBookDto: EnableBookDto,
  ): Promise<Book> {
    return await this.booksService.enableBook(bookCode, enableBookDto);
  }

  @Patch(':bookCode/disable')
  @ApiOperation({})
  async disableBook(@Param('bookCode') bookCode: number) {
    return await this.booksService.disableBook(bookCode);
  }

  @Get(':BookCode')
  @ApiProperty({ description: 'Obtiene un libro por su código' })
  async findById(@Param('BookCode') BookCode: number): Promise<Book> {
    try {
      return await this.booksService.findById(BookCode);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Obtener libros con paginación y filtros' })
  @ApiResponse({
    status: 200,
    description: 'Lista de libros paginada y filtrada',
    type: [Book],
  })
  @ApiResponse({ status: 400, description: 'Parámetros inválidos' })
  async findAll(@Query() paginationFilterDto: PaginationFilterDto) {
    return await this.booksService.findAll(paginationFilterDto);
  }
}
