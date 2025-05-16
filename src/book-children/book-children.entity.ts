/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { BookLoan } from '../book-loan/book-loan.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'books-children' })
export class BooksChildren {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Código  del libro' })
  BookCode: number;

  @Column()
  @ApiProperty({ description: 'Título del libro' })
  Title: string;

  @Column()
  @ApiProperty({ description: 'Autor del libro' })
  Author: string;

  @Column()
  @ApiProperty({ description: 'Editorial del libro' })
  Editorial: string;

  @Column()
  @ApiProperty({ description: 'Año de publicación' })
  PublishedYear: number;

  @Column()
  @ApiProperty({ description: 'ISBN del libro' })
  ISBN: string;

  @Column()
  @ApiProperty({ description: 'Categoría del libro' })
  ShelfCategory: string;

  @Column()
  @ApiProperty({ description: 'URL de la portada del libro' })
  Cover: string="https://i.pinimg.com/474x/f8/42/e5/f842e5de7b3f890a427671edc02484a5.jpg";

  @Column()
  @ApiProperty({ description: 'Calificación de la condición del libro' })
  BookConditionRating: number;

  @Column()
  @ApiProperty({ description: 'Código de firma' })
  SignatureCode: string;

  @Column()
  @ApiProperty({ description: 'Código de inscripción' })
  InscriptionCode: string;

  @Column()
  @ApiProperty({ description: 'Indica si el libro se puede está reservar' })
  ReserveBook: boolean;

  @Column()
  @ApiProperty({ description: 'Observaciones' })
  Observations: string;

  @Column()
  @ApiProperty({ description: 'Indica si esta deshabilitado' })
  Status: boolean = true;

  @OneToMany(() => BookLoan, (bookLoan) => bookLoan.childrenBook)
  bookLoans: BookLoan[];

  // relaciones

  //@ManyToOne(() => BookLoan, (bookLoan) => bookLoan.Books)
  // bookLoan: BookLoan;
}
