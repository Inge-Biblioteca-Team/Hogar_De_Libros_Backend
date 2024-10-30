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
import { ApiTags } from '@nestjs/swagger';
import { UpdateBookDto } from './DTO/update-book.dto';
import { Book } from './book.entity';
import { PaginationFilterDto } from './DTO/pagination-filter.dto';
import { EnableBookDto } from './DTO/enable-book.dto';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  async addBook(@Body() createBookDto: CreateBookDto): Promise<CreateBookDto> {
    return this.booksService.addBook(createBookDto);
  }

  @Patch(':bookCode/disable')
  async disableBook(@Param('bookCode') bookCode: number) {
    return await this.booksService.disableBook(bookCode);
  }

  @Patch(':bookCode')
  async updatePartial(
    @Param('bookCode') bookCode: number,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return await this.booksService.update(bookCode, updateBookDto);
  }

  @Put(':bookCode/enable')
  async enableBook(
    @Param('bookCode') bookCode: number,
    @Body() enableBookDto: EnableBookDto,
  ): Promise<Book> {
    return await this.booksService.enableBook(bookCode, enableBookDto);
  }

  @Get('/Colection')
  async findColection(@Query() paginationFilterDto: PaginationFilterDto) {
    return await this.booksService.getColecction(paginationFilterDto);
  }

  @Get(':BookCode')
  async findById(@Param('BookCode') BookCode: number): Promise<Book> {
    try {
      return await this.booksService.findById(BookCode);
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new NotFoundException(errorMessage);
    }
  }

  @Get()
  async findAll(@Query() paginationFilterDto: PaginationFilterDto) {
    return await this.booksService.findAll(paginationFilterDto);
  }
}
