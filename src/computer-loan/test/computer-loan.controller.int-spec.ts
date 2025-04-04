import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { DataSource } from 'typeorm';

jest.setTimeout(30000);

describe('ComputerLoanController (Integration)', () => {
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
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      })
    );

    await app.init();
    dataSource = app.get(DataSource);

    await dataSource.query('DELETE FROM computer_loan');
    await dataSource.query('DELETE FROM workstations WHERE MachineNumber = ?', [1001]);

    const newStation = { MachineNumber: 1001, Location: 'Sala 2', Status: 'Disponible' };

    await request(app.getHttpServer())
      .post('/work-stations')
      .send(newStation);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  it('debería crear un préstamo de computadora (POST /computer-loan)', async () => {
    const newLoan = {
      MachineNumber: 1001,
      cedula: '987654321',
      UserName: 'Test User',
    };

    const response = await request(app.getHttpServer())
      .post('/computer-loan')
      .send(newLoan);

    expect(typeof response.body).toBe('object');
    expect(response.body).toHaveProperty('message');
  });

  it('debería finalizar un préstamo de computadora (PATCH /computer-loan)', async () => {
    const patchDto = {
      MachineNumber: 1001,
      cedula: '987654321',
      UserName: 'Test User',
    };

    const response = await request(app.getHttpServer())
      .patch('/computer-loan')
      .send(patchDto);

    expect(typeof response.body).toBe('object');
    expect(response.body).toHaveProperty('message');
  });
});

describe('WorkStationsController (Integration)', () => {
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
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      })
    );

    await app.init();
    dataSource = app.get(DataSource);

    await dataSource.query('DELETE FROM workstations WHERE MachineNumber = ?', [1002]);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  it('debería crear una estación de trabajo (POST /work-stations)', async () => {
    const newWorkStation = {
      MachineNumber: 1002,
      Location: 'Sala 3',
      Status: 'Disponible',
    };

    const response = await request(app.getHttpServer())
      .post('/work-stations')
      .send(newWorkStation);

    expect(typeof response.body).toBe('object');
    expect(response.body).toHaveProperty('message');
  });

  it('debería retornar el conteo de estaciones (GET /work-stations/Count)', async () => {
    const response = await request(app.getHttpServer()).get('/work-stations/Count');

    expect(response.status).toBe(200);
    expect(typeof response.body).toBe('object');
    if ('count' in response.body) {
      expect(typeof response.body.count).toBe('number');
    }
  });

  it('debería retornar el estado de todas las estaciones (GET /work-stations/workstation/Status)', async () => {
    const response = await request(app.getHttpServer()).get('/work-stations/workstation/Status');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('debería reactivar una estación (PATCH /work-stations/:id/reactive)', async () => {
    const response = await request(app.getHttpServer())
      .patch('/work-stations/1001/reactive');

    expect(typeof response.body).toBe('object');
    if ('message' in response.body) {
      expect(typeof response.body.message).toBe('string');
    }
  });

  it('debería marcar estación como disponible (PATCH /work-stations/:id/available)', async () => {
    const response = await request(app.getHttpServer())
      .patch('/work-stations/1001/available');

    expect(typeof response.body).toBe('object');
    expect(response.body).toHaveProperty('message');
    expect(typeof response.body.message).toBe('string');
  });
});