import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { DataSource, getRepository } from 'typeorm';
import { Enrollment } from './enrollment.entity';
// Adjust the path as needed

jest.setTimeout(3000);

describe('EnrollmentController (Integration)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let createdCourseId: number;

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
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      })
    );

    await app.init();
    dataSource = app.get(DataSource);
    await dataSource.getRepository(Enrollment).delete({ userCedula: 'test-user-id', courseId: 1 }); 

  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  it('debería matricular un usuario (POST /enrollments/:courseId)', async () => {
    // Se asume que ya existe un curso con ID 1. Si necesitas crear uno dinámicamente, hazlo antes de esta prueba.
    createdCourseId = 1;

    const createEnrollmentDto = {
      userCedula: '123456789',
      direction: 'San José',
      phone: '88889999',
      ePhone: '87778888',
      email: 'test@example.com',
      UserName: 'Juan Pérez'
    };

    const enrollResponse = await request(app.getHttpServer())
      .post(`/enrollments/${createdCourseId}`)
      .send(createEnrollmentDto);

    console.log('ENROLL USER RESPONSE:', enrollResponse.body);
    expect(enrollResponse.status).toBeLessThan(500);
    expect(enrollResponse.body).toHaveProperty('message');
  });
});
