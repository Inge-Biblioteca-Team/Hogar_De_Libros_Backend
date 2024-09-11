/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { BookLoanModule } from 'src/book-loan/book-loan.module';

@Module({
  imports:[TypeOrmModule.forFeature([Book]) ],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [TypeOrmModule],
})
export class BooksModule {}
