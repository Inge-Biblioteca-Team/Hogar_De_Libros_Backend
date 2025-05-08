/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { BookLoanController } from './book-loan.controller';
import { BookLoanService } from './book-loan.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookLoan } from './book-loan.entity';
import { UserModule } from 'src/user/user.module';
import { BooksModule } from 'src/books/books.module';
import { NotesModule } from 'src/notes/notes.module';
import { BooksChildren } from 'src/book-children/book-children.entity';
import { MailsModule } from 'src/mails/mails.module';

@Module({
  imports: [
    UserModule,
    BooksModule,
    TypeOrmModule.forFeature([BookLoan, BooksChildren]),
    NotesModule,
    MailsModule
  ],
  controllers: [BookLoanController],
  providers: [BookLoanService],
  exports: [TypeOrmModule],
})
export class BookLoanModule {}
