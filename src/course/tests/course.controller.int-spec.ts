import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { DataSource } from 'typeorm';

jest.setTimeout(30000);

describe('CourseController (Integration)', () => {
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
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  it('debería crear un curso (POST /courses)', async () => {
    const newCourse = {
      courseName: 'Curso de Prueba',
      date: new Date(),
      courseTime: '10:00',
      location: 'Sala A',
      instructor: 'Juan Pérez',
      courseType: 'Taller',
      targetAge: 18,
      capacity: 30,
      endDate: new Date(Date.now() + 86400000),
      materials: 'Ninguno',
      duration: '2 horas'
    };

    const response = await request(app.getHttpServer())
      .post('/courses')
      .send(newCourse);

    console.log('CREATE COURSE RESPONSE:', response.body);

    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(500);
    expect(response.body).toHaveProperty('message');

    const coursesResponse = await request(app.getHttpServer()).get('/courses?courseName=Curso de Prueba');
    console.log('GET COURSES RESPONSE:', coursesResponse.body);

    expect(coursesResponse.status).toBe(200);
    expect(coursesResponse.body).toHaveProperty('data');
    expect(Array.isArray(coursesResponse.body.data)).toBe(true);
    expect(coursesResponse.body.data.length).toBeGreaterThan(0);
    createdCourseId = coursesResponse.body.data[0]?.courseId;
    console.log('CREATED COURSE ID:', createdCourseId);
    expect(createdCourseId).toBeDefined();
  });



  it('debería obtener próximos cursos (GET /courses/NextCourtes)', async () => {
    const response = await request(app.getHttpServer()).get('/courses/NextCourtes');
    console.log('GET NEXT COURSES RESPONSE:', response.body);

    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(500);
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('debería actualizar un curso (PATCH /courses/:id)', async () => {
    const updateData = {
      instructor: 'Carlos López',
    };

    const response = await request(app.getHttpServer())
      .patch(`/courses/${createdCourseId}`)
      .send(updateData);

    console.log('UPDATE COURSE RESPONSE:', response.body);

    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(500);
    expect(response.body).toHaveProperty('message');
  });

  it('debería deshabilitar un curso (PATCH /courses/:id/disable)', async () => {
    const response = await request(app.getHttpServer()).patch(`/courses/${createdCourseId}/disable`);

    console.log('DISABLE COURSE RESPONSE:', response.body);

    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(500);
    expect(response.body).toHaveProperty('message');
  });

  it('debería obtener lista de cursos por fecha (GET /courses/CourseList)', async () => {
    const fecha = new Date().toISOString();
    const response = await request(app.getHttpServer()).get(`/courses/CourseList?fecha=${fecha}`);

    console.log('COURSE LIST BY DATE RESPONSE:', response.body);

    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(500);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
