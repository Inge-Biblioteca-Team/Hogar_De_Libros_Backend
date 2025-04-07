import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { DataSource } from 'typeorm';

jest.setTimeout(30000);

describe('RoomReservationController (Integration)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let createdReservationId: number;

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
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
    dataSource = app.get(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  it('debería crear una reserva de sala (POST /room-reservation)', async () => {
    const newReservation = {
      name: 'Universidad Nacional',
      date: new Date(),
      selectedHours: [9, 10],
      observations: 'Reserva para evento académico',
      userCedula: '123456789',
      roomId: 1,
    };

    const response = await request(app.getHttpServer())
      .post('/room-reservation')
      .send(newReservation);

    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(500);
    expect(response.body).toHaveProperty('message');
  });

  it('debería obtener todas las reservas (GET /room-reservation)', async () => {
    const response = await request(app.getHttpServer()).get('/room-reservation');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('debería obtener reservas en cola (GET /room-reservation/queque)', async () => {
    const response = await request(app.getHttpServer()).get('/room-reservation/queque');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('debería contar reservas por cédula (GET /room-reservation/count/:userCedula)', async () => {
    const response = await request(app.getHttpServer()).get('/room-reservation/count/123456789');
    expect(response.status).toBe(200);
    expect(typeof response.body.count).toBe('number');
  });

  it('debería obtener reservas del usuario (GET /room-reservation/user)', async () => {
    const response = await request(app.getHttpServer()).get('/room-reservation/user');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});
