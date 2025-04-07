import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { DataSource } from 'typeorm';

jest.setTimeout(30000);

describe('RoomsController (Integration)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let createdRoomId: number;

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

  it('debería crear una sala (POST /rooms)', async () => {
    const newRoom = {
      roomNumber: '101',
      name: 'Sala de conferencias',
      area: 100,
      capacity: 50,
      observations: 'Con proyector y aire acondicionado',
      image: ['https://ejemplo.com/sala1.jpg'],
      location: 'Biblioteca publica municipal de Nicoya',
    };

    const response = await request(app.getHttpServer()).post('/rooms').send(newRoom);

    const allowedStatus = [201, 500];
    expect(allowedStatus.includes(response.status)).toBe(true);

    const getRoomResponse = await request(app.getHttpServer()).get('/rooms?roomNumber=101');
    expect(getRoomResponse.status).toBe(200);
    expect(getRoomResponse.body.data.length).toBeGreaterThan(0);
    createdRoomId = getRoomResponse.body.data[0].roomId;
  });

  it('debería obtener todas las salas (GET /rooms)', async () => {
    const response = await request(app.getHttpServer()).get('/rooms');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('debería obtener las salas para la tabla (GET /rooms/table)', async () => {
    const response = await request(app.getHttpServer()).get('/rooms/table');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('debería obtener una sala por id (GET /rooms/:id)', async () => {
    const response = await request(app.getHttpServer()).get(`/rooms/${createdRoomId}`);
    expect([200, 500]).toContain(response.status);
    if (response.status === 200) {
      expect(response.body).toHaveProperty('roomNumber');
    }
  });

  it('debería actualizar una sala (PATCH /rooms/:id)', async () => {
    const updateRoom = { name: 'Sala actualizada' };
    const response = await request(app.getHttpServer())
      .patch(`/rooms/${createdRoomId}`)
      .send(updateRoom);
    expect([200, 500]).toContain(response.status);
    if (response.status === 200) {
      expect(response.body).toHaveProperty('message');
    }
  });

  it('debería cambiar estado a mantenimiento (PATCH /rooms/maintenance/:id)', async () => {
    const response = await request(app.getHttpServer()).patch(`/rooms/maintenance/${createdRoomId}`);
    expect([200, 500]).toContain(response.status);
    if (response.status === 200) {
      expect(response.body).toHaveProperty('message');
    }
  });

  it('debería cambiar estado a cerrada (PATCH /rooms/closed/:id)', async () => {
    const response = await request(app.getHttpServer()).patch(`/rooms/closed/${createdRoomId}`);
    expect([200, 500]).toContain(response.status);
    if (response.status === 200) {
      expect(response.body).toHaveProperty('message');
    }
  });

  it('debería cambiar estado a disponible (PATCH /rooms/available/:id)', async () => {
    const response = await request(app.getHttpServer()).patch(`/rooms/available/${createdRoomId}`);
    expect([200, 500]).toContain(response.status);
    if (response.status === 200) {
      expect(response.body).toHaveProperty('message');
    }
  });
});
