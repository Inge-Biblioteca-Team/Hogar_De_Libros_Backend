import { ApiProperty } from "@nestjs/swagger";

export class Book {
    @ApiProperty({ description: 'Código único del libro' })
    BookCode: string;

    @ApiProperty({ description: 'Título del libro' })
    Title: string;

    @ApiProperty({ description: 'Autor del libro' })
    Author: string;

    @ApiProperty({ description: 'Editorial del libro' })
    Editorial: string;

    @ApiProperty({ description: 'Año de publicación' })
    PublishedYear: number;

    @ApiProperty({ description: 'ISBN del libro' })
    ISBN: number;

    @ApiProperty({ description: 'Categoría del libro' })
    BookCategory: string;

    @ApiProperty({ description: 'URL de la portada del libro' })
    Cover:string;

    @ApiProperty({ description: 'Calificación de la condición del libro' })
    BookConditionRating:number;

    @ApiProperty({ description: 'Número de estante donde se encuentra el libro' })
    ShelfNumber:number;

    @ApiProperty({ description: 'Código de firma' })
    SignatureCode:number;

    @ApiProperty({ description: 'Código de inscripción' })
    InscriptionCode:number;

    @ApiProperty({ description: 'Indica si el libro está reservado' })
    Reserva :boolean;

  }