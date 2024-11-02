/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { BookChildrenService } from './book-children.service';
import { CreateBookChildrenDto } from './DTO/create-book-children.dto';
import { UpdateBookChildrenDto } from './DTO/update-book-children.dto';
import { BooksChildren } from './book-children.entity';
import { PaginationFilterChildrenDto } from './DTO/pagination-filter-children.dto';

@ApiTags('book-children')
@Controller('book-children')
export class BookChildrenController {
  constructor(private readonly bookChildrenService: BookChildrenService) {}

  @Post()
  async addBookChildren(
    @Body() createBookChildrenDto: CreateBookChildrenDto,
  ): Promise<{ message: string }> {
    return this.bookChildrenService.addBook(createBookChildrenDto);
  }

  @Patch(':bookChildCode')
  async updatePartial(
    @Param('bookChildCode') bookChildCode: number,
    @Body() updateBookChildDto: UpdateBookChildrenDto,
  ): Promise<{ message: string }> {
    return await this.bookChildrenService.update(
      bookChildCode,
      updateBookChildDto,
    );
  }

  @Put(':bookChildCode/enable')
  async enableBookChild(
    @Param('bookChildCode') bookChildCode: number,
  ): Promise<{ message: string }> {
    return await this.bookChildrenService.enableBook(bookChildCode);
  }

  @Patch(':bookChildCode/disable')
  async disableBookChild(
    @Param('bookChildCode') bookChildCode: number,
  ): Promise<{ message: string }> {
    return await this.bookChildrenService.disableBook(bookChildCode);
  }

  @Get(':bookChildCode')
  async findById(
    @Param('bookChildCode') bookChildCode: number,
  ): Promise<BooksChildren> {
    return await this.bookChildrenService.findById(bookChildCode);
  }

  @Get()
  @ApiResponse({ status: 400, description: 'Parámetros inválidos' })
  async findAll(@Query() paginationFilterDto: PaginationFilterChildrenDto) {
    return await this.bookChildrenService.findAll(paginationFilterDto);
  }
}
