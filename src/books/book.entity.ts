/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { BookLoan } from 'src/book-loan/book-loan.entity';

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'books' })
export class Book {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Código  del libro' })
  BookCode: number;

  @Column({ type: 'text' })
  @ApiProperty({ description: 'Título del libro' })
  Title: string;

  @Column({ type: 'text' })
  @ApiProperty({ description: 'Autor del libro' })
  Author: string;

  @Column({ type: 'text' })
  @ApiProperty({ description: 'Editorial del libro' })
  Editorial: string;

  @Column()
  @ApiProperty({ description: 'Año de publicación' })
  PublishedYear: number;

  @Column({ type: 'text' })
  @ApiProperty({ description: 'ISBN del libro' })
  ISBN: string;

  @Column()
  @ApiProperty({ description: 'Categoría del libro' })
  ShelfCategory: string;

  @Column({ type: 'text' })
  @ApiProperty({ description: 'URL de la portada del libro' })
  Cover: string =
    'https://img.freepik.com/free-vector/hand-drawn-flat-design-stack-books-illustration_23-2149330605.jpg?w=360';

  @Column()
  @ApiProperty({ description: 'Calificación de la condición del libro' })
  BookConditionRating: number;

  @Column({ type: 'text' })
  @ApiProperty({ description: 'Código de firma' })
  signatureCode: string;

  @Column()
  @ApiProperty({ description: 'Código de inscripción' })
  InscriptionCode: string;

  @Column()
  @ApiProperty({ description: 'Indica si el libro se puede está reservar' })
  ReserveBook: boolean;

  @Column({ type: 'text' })
  @ApiProperty({ description: 'Observaciones' })
  Observations: string;

  @Column()
  @ApiProperty({ description: 'Indica si esta deshabilitado' })
  Status: boolean = true;

  // relaciones
  @OneToMany(() => BookLoan, (bookLoan) => bookLoan.book)
  bookLoans: BookLoan[];
}
