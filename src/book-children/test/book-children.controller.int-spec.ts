import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';
import { DataSource } from 'typeorm';

jest.setTimeout(15000);

describe('BookChildrenController (Integration)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let createdBook: any;

  const newBookChild = {
    Title: 'Cuento Infantil',
    Author: 'Autor Infantil',
    Editorial: 'Editorial Infantil',
    PublishedYear: 2023,
    ISBN: 'INF-123456',
    ShelfCategory: 'Infantil',
    Cover: 'https://fakeurl.com/child.jpg',
    BookConditionRating: 10,
    SignatureCode: 'SIG-INF',
    InscriptionCode: 'INS-INF',
    ReserveBook: false,
    Observations: 'Libro para niños',
  };

  const createBookChild = async () => {
    const response = await request(app.getHttpServer()).post('/book-children').send(newBookChild);
    console.log('CREATE RESPONSE:', response.body);
    const listResponse = await request(app.getHttpServer()).get('/book-children');
    console.log('LIST RESPONSE:', listResponse.body);
    const books = listResponse.body.data || listResponse.body;
    createdBook = books.find((b: any) => b.ISBN === newBookChild.ISBN);
    console.log('FOUND BOOK:', createdBook);
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.init();
    dataSource = app.get(DataSource);
    await createBookChild();
  });

  afterAll(async () => {
    await dataSource.query('DELETE FROM `books-children` WHERE ISBN = ?', [newBookChild.ISBN]);
    await dataSource.destroy();
    await app.close();
  });

  it('debería crear un libro infantil (POST /book-children)', async () => {
    const response = await request(app.getHttpServer())
      .post('/book-children')
      .send({ ...newBookChild, ISBN: 'UNIQUE-' + Date.now() });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message');
  });

  it('debería obtener lista de libros infantiles (GET /book-children)', async () => {
    const response = await request(app.getHttpServer())
      .get('/book-children');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data || response.body)).toBe(true);
  });

  it('debería obtener un libro infantil por ID (GET /book-children/:id)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/book-children/${createdBook.BookCode}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('Title', newBookChild.Title);
  });

  it('debería actualizar parcialmente un libro infantil (PATCH /book-children/:id)', async () => {
    const updateDto = { Title: 'Cuento Infantil Actualizado' };

    const response = await request(app.getHttpServer())
      .patch(`/book-children/${createdBook.BookCode}`)
      .send(updateDto);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
  });

  it('debería desactivar un libro infantil (PATCH /book-children/:id/disable)', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/book-children/${createdBook.BookCode}/disable`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
  });

  it('debería reactivar un libro infantil (PUT /book-children/:id/enable)', async () => {
    const response = await request(app.getHttpServer())
      .put(`/book-children/${createdBook.BookCode}/enable`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
  });
});