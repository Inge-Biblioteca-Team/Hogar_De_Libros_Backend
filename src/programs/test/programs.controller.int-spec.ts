import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { DataSource } from 'typeorm';

jest.setTimeout(3000);

describe('ProgramsController (Integration)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let createdProgramId: number;

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

  it('debería crear un programa (POST /programs)', async () => {
    const newProgram = {
      programName: 'Programa de Prueba',
      description: 'Este es un programa de prueba',
    };

    const response = await request(app.getHttpServer())
      .post('/programs')
      .send(newProgram);

    console.log('CREATE PROGRAM RESPONSE:', response.body);

    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(500);
    expect(response.body).toHaveProperty('message');

    const listResponse = await request(app.getHttpServer()).get('/programs/All');
    console.log('LIST PROGRAMS RESPONSE:', listResponse.body);

    createdProgramId = listResponse.body.data.find(
      (p) => p.programName === 'Programa de Prueba'
    )?.programsId;

    console.log('CREATED PROGRAM ID:', createdProgramId);
    expect(createdProgramId).toBeDefined();
  });

  it('debería obtener programa por id (GET /programs/:id)', async () => {
    expect(createdProgramId).toBeDefined();
    const response = await request(app.getHttpServer()).get(`/programs/${createdProgramId}`);
    console.log('GET PROGRAM BY ID RESPONSE:', response.body);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('programName');
  });

  it('debería actualizar el programa (PATCH /programs/:id)', async () => {
    expect(createdProgramId).toBeDefined();
    const updateData = { description: 'Descripción actualizada' };
    const response = await request(app.getHttpServer())
      .patch(`/programs/${createdProgramId}`)
      .send(updateData);

    console.log('UPDATE PROGRAM RESPONSE:', response.body);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
  });

  it('debería desactivar el programa (PATCH /programs/:id/disable)', async () => {
    expect(createdProgramId).toBeDefined();
    const response = await request(app.getHttpServer())
      .patch(`/programs/${createdProgramId}/disable`);

    console.log('DISABLE PROGRAM RESPONSE:', response.body);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
  });

  it('debería obtener los nombres de programas activos (GET /programs/Actived)', async () => {
    const response = await request(app.getHttpServer()).get('/programs/Actived');
    console.log('ACTIVE PROGRAM NAMES RESPONSE:', response.body);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('debería obtener actividades (GET /programs/Activities)', async () => {
    const response = await request(app.getHttpServer()).get('/programs/Activities');
    console.log('PROGRAM ACTIVITIES RESPONSE:', response.body);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
  });
});
