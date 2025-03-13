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
  UseGuards,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './DTO/create-book.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateBookDto } from './DTO/update-book.dto';
import { Book } from './book.entity';
import { PaginationFilterDto } from './DTO/pagination-filter.dto';
import { EnableBookDto } from './DTO/enable-book.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { OpacFiltroDto } from './DTO/opac-filtro.dto';


@ApiTags('books')
@Controller('books')

export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'asistente')
  async addBook(@Body() createBookDto: CreateBookDto): Promise<{message:string}> {
    return this.booksService.addBook(createBookDto);
  }
// Cambiar a promise message, darle promise
  @Patch(':bookCode/disable')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async disableBook(@Param('bookCode') bookCode: number):Promise<{message:string}> {
    return await this.booksService.disableBook(bookCode);
  }
// Cambiar a promise message, darle
  @Patch(':bookCode')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async updatePartial(
    @Param('bookCode') bookCode: number,
    @Body() updateBookDto: UpdateBookDto,
  ):Promise<{message:string}> {
    return await this.booksService.update(bookCode, updateBookDto);
  }

  // Cambiar a promise message, 
  @Put(':bookCode/enable')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async enableBook(
    @Param('bookCode') bookCode: number,
    @Body() enableBookDto: EnableBookDto,
  ):Promise<{message:string}> {
    return await this.booksService.enableBook(bookCode, enableBookDto);
  }

  @Get('/Colection')
  async findColection(@Query() paginationFilterDto: PaginationFilterDto) {
    return await this.booksService.getColecction(paginationFilterDto);
  }

  @Get('/Categories')
  async getCategoriesNames(){
    return await this.booksService.getCategoriesNames()
  }

// PEDNIENTE DE ELIMINACOIN SI NO SE USA
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
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'asistente')
  async findAll(@Query() paginationFilterDto: PaginationFilterDto) {
    return await this.booksService.findAll(paginationFilterDto);
  }

  @Get('/opac/opac-filtro')
  async opacFiltro(@Query() filterDto: OpacFiltroDto): Promise<Book[]> {
    console.log('Request recibida en el controlador:', filterDto);  // <-- Añadido para depurar.
    return this.booksService.opacFiltro(filterDto);
  }
}
