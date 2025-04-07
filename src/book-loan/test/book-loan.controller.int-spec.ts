import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';

let createdBookId: number;

describe('BooksController (Integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // aquí inicializas tu aplicación
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('debería crear un libro correctamente (POST /books)', async () => {
    const bookData = {
      Title: 'Cien años de soledad',
      Author: 'Gabriel García Márquez',
      Editorial: 'Sudamericana',
      PublishedYear: 1967,
      ISBN: '1234567890',
      ShelfCategory: 'Literatura',
      Cover: 'https://ejemplo.com/portada.jpg',
      BookConditionRating: 5,
      signatureCode: 'SIG-001',
      InscriptionCode: 'INS-001',
      ReserveBook: false,
      Observations: 'Buen estado',
      Status: true,
    };
  
    const response = await request(app.getHttpServer())
      .post('/books')
      .send(bookData);
  
    console.log('POST BOOK RESPONSE:', response.body);
  
    expect(response.status).toBeLessThan(500);
    expect(response.body).toHaveProperty('book');
  
    createdBookId = response.body.book?.BookCode;
    console.log('CREATED BOOK ID:', createdBookId);
    expect(createdBookId).toBeDefined();
  });
  

  afterAll(async () => {
    await app.close();
  });
});
