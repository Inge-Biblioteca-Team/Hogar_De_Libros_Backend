import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { DataSource } from 'typeorm';

jest.setTimeout(30000);

describe('DonationController (Integration)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let createdDonationId: number;

  const donationDto = {
    UserFullName: 'Juan Pérez',
    UserCedula: '123456789',
    UserAddress: 'Dirección de prueba',
    UserPhone: '88889999',
    UserEmail: 'juan@example.com',
    SubCategory: 'Libros',
    DateRecolatedDonation: '2025-06-01',
    ResourceCondition: 'Bueno',
    ItemDescription: 'Libros escolares usados',
    Document: []
  };

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
    if (app) await app.close();
    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  it('debería crear una donación (POST /donation)', async () => {
    const response = await request(app.getHttpServer())
      .post('/donation')
      .send(donationDto);

    console.log('CREATE DONATION RESPONSE:', response.body);
    expect(response.status).toBeLessThan(500);
    expect(response.body).toHaveProperty('message');
  });

  
});
