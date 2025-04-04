import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';
import { DataSource } from 'typeorm';

jest.setTimeout(15000);

describe('ComputersController (Integration)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let createdComputer: any;

  const newComputer = {
    MachineNumber: 999,
    EquipmentSerial: `SERIAL-${Date.now()}`,
    EquipmentBrand: 'HP',
    ConditionRating: 4,
    Observation: 'Pantalla rota',
    EquipmentCategory: 'Laptop',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(require('src/auth/guards/auth.guard').AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(require('src/auth/guards/roles.guard').RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

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
  });

  afterAll(async () => {
    await dataSource.query('DELETE FROM computers WHERE MachineNumber = ?', [newComputer.MachineNumber]);
    await dataSource.destroy();
    await app.close();
  });

  it('debería crear una computadora (POST /computers)', async () => {
    const response = await request(app.getHttpServer()).post('/computers').send(newComputer);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message');
  });

  it('debería obtener todas las computadoras (GET /computers)', async () => {
    const response = await request(app.getHttpServer()).get('/computers');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data || response.body)).toBe(true);
  });

  it('debería obtener una computadora por código (GET /computers/:EquipmentUniqueCode)', async () => {
    const getAll = await request(app.getHttpServer()).get('/computers');
    const all = getAll.body.data || getAll.body;
    createdComputer = all.find((c) => c.MachineNumber === newComputer.MachineNumber);
    expect(createdComputer).toBeDefined();

    const response = await request(app.getHttpServer()).get(`/computers/${createdComputer.EquipmentUniqueCode}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('MachineNumber', newComputer.MachineNumber);
  });

  it('debería modificar una computadora (PUT /computers/:EquipmentUniqueCode)', async () => {
    const updateDto = {
      EquipmentBrand: 'Acer',
      Observation: 'Actualizado',
    };

    const response = await request(app.getHttpServer())
      .put(`/computers/${createdComputer.EquipmentUniqueCode}`)
      .send(updateDto);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('affected', 1);
      
  });

  it('debería desactivar una computadora (PATCH /computers/:EquipmentUniqueCode)', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/computers/${createdComputer.EquipmentUniqueCode}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('Status', false);
      expect(response.body).toHaveProperty('EquipmentUniqueCode', createdComputer.EquipmentUniqueCode);
      
  });
});
