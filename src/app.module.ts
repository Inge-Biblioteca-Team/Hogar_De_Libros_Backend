/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './books/book.entity';
import { Computer } from './computers/computer.entity';
import { ComputersModule } from './computers/computers.module';
import { BookLoanModule } from './book-loan/book-loan.module';
import { UserModule } from './user/user.module';
import { ComputerLoanModule } from './computer-loan/computer-loan.module';
import { BookLoan } from './book-loan/book-loan.enity';
import { ComputerLoan } from './computer-loan/computer-loan.entity';
import { User } from './user/user.entity';
import { BookChildrenModule } from './book-children/book-children.module';
import * as dotenv from 'dotenv';
import { BooksChildren } from './book-children/book-children.entity';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import { WorkStation } from './computers/WorkStation.entity';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: "localhost",
      port: 3308,
      username: "root",
      password: "root",
      database: "test",
      entities: [Book, Computer, BookLoan, ComputerLoan, User, BooksChildren, WorkStation],
      synchronize: true,
    }),
    BooksModule,
    ComputersModule,
    BookLoanModule,
    UserModule,
    ComputerLoanModule,
    BookChildrenModule,
    FilesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
