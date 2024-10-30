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
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BookChildrenService } from './book-children.service';
import { CreateBookChildrenDto } from './DTO/create-book-children.dto';
import { UpdateBookChildrenDto } from './DTO/update-book-children.dto';
import { EnableBookChildrenDto } from './DTO/enable-book-children.dto';
import { BooksChildren } from './book-children.entity';
import { PaginationFilterChildrenDto } from './DTO/pagination-filter-children.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { Role } from 'src/user/user.entity';

@ApiTags('book-children')
@Controller('book-children')
@UseGuards(AuthGuard, RolesGuard)
export class BookChildrenController {
  constructor(private readonly bookChildrenService: BookChildrenService) {}

  @Post()
  @Roles(Role.Admin, Role.Creator)
  @ApiBody({ type: CreateBookChildrenDto })
  @ApiResponse({
    status: 201,
    description: 'Create a new book child',
    type: CreateBookChildrenDto,
  })
  async addBookChildren(
    @Body() createBookChildrenDto: CreateBookChildrenDto,
  ): Promise<CreateBookChildrenDto> {
    return this.bookChildrenService.addBook(createBookChildrenDto);
  }

  @Patch(':bookChildCode')
  @Roles(Role.Admin, Role.Creator)
  @ApiOperation({})
  async updatePartial(
    @Param('bookChildCode') bookChildCode: number,
    @Body() updateBookChildDto: UpdateBookChildrenDto,
  ) {
    return await this.bookChildrenService.update(
      bookChildCode,
      updateBookChildDto,
    );
  }

  @Put(':bookChildCode/enable')
  @Roles(Role.Admin)
  @ApiOperation({})
  @ApiParam({
    name: 'bookChildCode',
    type: Number,
    description: 'Código del libro infantil a habilitar',
  })
  @ApiBody({ type: EnableBookChildrenDto })
  @ApiResponse({
    status: 200,
    description: 'Libro infantil habilitado exitosamente',
    type: BooksChildren,
  })
  @ApiResponse({ status: 404, description: 'Libro infantil no encontrado' })
  async enableBookChild(
    @Param('bookChildCode') bookChildCode: number,
    @Body() enableBookChildDto: EnableBookChildrenDto,
  ): Promise<BooksChildren> {
    return await this.bookChildrenService.enableBook(
      bookChildCode,
      enableBookChildDto,
    );
  }

  @Patch(':bookChildCode/disable')
  @Roles(Role.Admin)
  @ApiOperation({})
  async disableBookChild(@Param('bookChildCode') bookChildCode: number) {
    return await this.bookChildrenService.disableBook(bookChildCode);
  }

  @Get(':bookChildCode')
  @Roles(Role.Admin, Role.Creator, Role.ExternalUser, Role.Reception)
  @ApiProperty({ description: 'Obtiene un libro infantil por su código' })
  async findById(
    @Param('bookChildCode') bookChildCode: number,
  ): Promise<BooksChildren> {
    try {
      return await this.bookChildrenService.findById(bookChildCode);
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new NotFoundException(errorMessage);
    }
  }

  @Get()
  @Roles(Role.Admin, Role.Creator, Role.ExternalUser, Role.Reception)
  @ApiOperation({
    summary: 'Obtener libros infantiles con paginación y filtros',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de libros infantiles paginada y filtrada',
    type: [BooksChildren],
  })
  @ApiResponse({ status: 400, description: 'Parámetros inválidos' })
  async findAll(@Query() paginationFilterDto: PaginationFilterChildrenDto) {
    return await this.bookChildrenService.findAll(paginationFilterDto);
  }
}
