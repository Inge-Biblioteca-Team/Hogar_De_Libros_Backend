import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './books/book.entity';
import { Computer } from './computers/computer.entity';
import { ComputersModule } from './computers/computers.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'hogar_de_libros',
    entities: [Book, Computer],
    synchronize: true
    

   }), BooksModule, ComputersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
