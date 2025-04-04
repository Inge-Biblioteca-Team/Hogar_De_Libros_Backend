import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

jest.setTimeout(15000);

describe('BooksController (Integration)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    dataSource = app.get(DataSource);
  });

  afterAll(async () => {
    if (dataSource) await dataSource.destroy();
    if (app) await app.close();
  });

  beforeEach(async () => {
    await dataSource.query('DELETE FROM book_loans');
    await dataSource.query('DELETE FROM books');
  });

  it('debería crear un libro sin errores', async () => {
    const newBook = {
      Title: 'Libro de Integración',
      Author: 'Tester Uno',
      Editorial: 'Editorial de Prueba',
      PublishedYear: 2024,
      ISBN: '1111-11-1111',
      ShelfCategory: 'Ciencia Ficción',
      Cover: 'https://fake-url.com/portada.jpg',
      BookConditionRating: 10,
      signatureCode: 'SIG-INT-001',
      InscriptionCode: 'INS-INT-001',
      ReserveBook: false,
      Observations: 'Libro de prueba automática',
    };

    const postResponse = await request(app.getHttpServer())
      .post('/books')
      .send(newBook);

   

    expect(postResponse.status).toBe(201);
    expect(postResponse.body).toHaveProperty('message');

    const getResponse = await request(app.getHttpServer())
  .get('/books');


expect(getResponse.status).toBe(200);

const books = getResponse.body.data || getResponse.body;
const book = books.find((b) => b.Title === newBook.Title);

expect(book).toBeDefined();
expect(book.Author).toBe(newBook.Author);

  });

  it('debería crear y luego desactivar un libro (PATCH /books/:bookCode/disable)', async () => {
    const newBook = {
      Title: 'Libro para desactivar',
      Author: 'Autor Apagado',
      Editorial: 'Editorial Oscura',
      PublishedYear: 2023,
      ISBN: '9999-99-9999',
      ShelfCategory: 'Suspenso',
      Cover: 'https://fake-url.com/oscuro.jpg',
      BookConditionRating: 7,
      signatureCode: 'SIG-APAGADO-01',
      InscriptionCode: 'INS-APAGADO-01',
      ReserveBook: false,
      Observations: 'Este libro será desactivado',
    };
  
    // 1. Crear el libro
    const postResponse = await request(app.getHttpServer())
      .post('/books')
      .send(newBook);
  
    expect(postResponse.status).toBe(201);
  
    // 2. Obtener el libro para conseguir el BookCode
    const getResponse = await request(app.getHttpServer())
      .get('/books');
  
    const books = getResponse.body.data || getResponse.body;
    const book = books.find((b) => b.Title === newBook.Title);
  
    expect(book).toBeDefined();
    expect(book.BookCode).toBeDefined();
  
    // 3. Desactivar el libro
    const disableResponse = await request(app.getHttpServer())
      .patch(`/books/${book.BookCode}/disable`)
      .send(); // no se necesita body
  
  
    expect(disableResponse.status).toBe(200);
    expect(disableResponse.body).toHaveProperty('message');
  });
  
  it('debería actualizar parcialmente un libro (PATCH /books/:BookCode)', async () => {
    const newBook = {
      Title: 'Libro editable',
      Author: 'Autor Editado',
      Editorial: 'Editorial X',
      PublishedYear: 2021,
      ISBN: '1234-56-7890',
      ShelfCategory: 'Drama',
      Cover: 'https://fake-url.com/drama.jpg',
      BookConditionRating: 6,
      signatureCode: 'SIG-EDIT',
      InscriptionCode: 'INS-EDIT',
      ReserveBook: false,
      Observations: 'Inicial',
    };
  
    // Crear libro
    const postResponse = await request(app.getHttpServer())
      .post('/books')
      .send(newBook);
    expect(postResponse.status).toBe(201);
  
    // Obtener el libro
    const getResponse = await request(app.getHttpServer())
      .get('/books');
    const books = getResponse.body.data || getResponse.body;
    const book = books.find((b) => b.Title === newBook.Title);
    expect(book).toBeDefined();
  
    // Actualizar solo el título y observaciones
    const updatedFields = {
      Title: 'Libro editado',
      Observations: 'Actualizado por test',
    };
  
    const patchResponse = await request(app.getHttpServer())
      .patch(`/books/${book.BookCode}`)
      .send(updatedFields);
  
  
    expect(patchResponse.status).toBe(200);
    expect(patchResponse.body).toHaveProperty('message');
  });
  
  it('debería desactivar y luego reactivar un libro (PUT /books/:BookCode/enable)', async () => {
    const newBook = {
      Title: 'Libro reactivable',
      Author: 'Autor On-Off',
      Editorial: 'Editorial Toggle',
      PublishedYear: 2020,
      ISBN: '2222-22-2222',
      ShelfCategory: 'Acción',
      Cover: 'https://fake-url.com/onoff.jpg',
      BookConditionRating: 5,
      signatureCode: 'SIG-REACT',
      InscriptionCode: 'INS-REACT',
      ReserveBook: false,
      Observations: 'Listo para ser reactivado',
    };
  
    // Crear libro
    const postResponse = await request(app.getHttpServer())
      .post('/books')
      .send(newBook);
    expect(postResponse.status).toBe(201);
  
    // Obtener BookCode
    const getResponse = await request(app.getHttpServer())
      .get('/books');
    const books = getResponse.body.data || getResponse.body;
    const book = books.find((b) => b.Title === newBook.Title);
    expect(book).toBeDefined();
  
    // Desactivar
    const disableResponse = await request(app.getHttpServer())
      .patch(`/books/${book.BookCode}/disable`)
      .send();
    expect(disableResponse.status).toBe(200);
  
    // Reactivar
    const enableResponse = await request(app.getHttpServer())
    .put(`/books/${book.BookCode}/enable`)
    .send({ EnableBook: true }); 
  

    expect(enableResponse.status).toBe(200);
    expect(enableResponse.body).toEqual({});
  
  
    
  });
  
});
