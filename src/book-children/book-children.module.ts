/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { BookChildrenController } from './book-children.controller';
import { BookChildrenService } from './book-children.service';
import { BooksChildren } from './book-children.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([BooksChildren])],
  controllers: [BookChildrenController],
  providers: [BookChildrenService],
})
export class BookChildrenModule {}
