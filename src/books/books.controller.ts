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
import { Role } from 'src/user/user.entity';

@ApiTags('books')
@Controller('books')
@UseGuards(AuthGuard, RolesGuard)
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @Roles(Role.Admin, Role.Creator)
  async addBook(@Body() createBookDto: CreateBookDto): Promise<CreateBookDto> {
    return this.booksService.addBook(createBookDto);
  }

  @Patch(':bookCode/disable')
  @Roles(Role.Admin)
  async disableBook(@Param('bookCode') bookCode: number) {
    return await this.booksService.disableBook(bookCode);
  }

  @Patch(':bookCode')
  @Roles(Role.Admin, Role.Creator)
  async updatePartial(
    @Param('bookCode') bookCode: number,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return await this.booksService.update(bookCode, updateBookDto);
  }

  @Put(':bookCode/enable')
  @Roles(Role.Admin)
  async enableBook(
    @Param('bookCode') bookCode: number,
    @Body() enableBookDto: EnableBookDto,
  ): Promise<Book> {
    return await this.booksService.enableBook(bookCode, enableBookDto);
  }

  @Get('/Colection')
  @Roles(Role.Admin, Role.Creator, Role.ExternalUser, Role.Reception)
  async findColection(@Query() paginationFilterDto: PaginationFilterDto) {
    return await this.booksService.getColecction(paginationFilterDto);
  }

  @Get(':BookCode')
  @Roles(Role.Admin, Role.Creator, Role.ExternalUser, Role.Reception)
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
  @Roles(Role.Admin, Role.Creator, Role.ExternalUser, Role.Reception)
  async findAll(@Query() paginationFilterDto: PaginationFilterDto) {
    return await this.booksService.findAll(paginationFilterDto);
  }
}
