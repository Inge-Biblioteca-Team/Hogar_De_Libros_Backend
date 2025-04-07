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
    try {
      // Dale tiempo a los procesos internos antes de cerrar la conexión
      await new Promise((resolve) => setTimeout(resolve, 500));
  
      if (app) await app.close();
      if (dataSource && dataSource.isInitialized) {
        await dataSource.destroy();
      }
    } catch (error) {
      console.error('Error al cerrar los recursos:', error);
    }
  });
  

  it('debería crear una donación (POST /donation)', async () => {
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

    const response = await request(app.getHttpServer())
      .post('/donation')
      .send(donationDto);

    console.log('CREATE DONATION RESPONSE:', response.body);
    expect(response.status).toBeLessThan(500);
    expect(response.body).toHaveProperty('message');
  });

  it('debería listar las donaciones (GET /donation)', async () => {
    const response = await request(app.getHttpServer()).get('/donation?page=1&limit=10');
    console.log('LIST DONATIONS RESPONSE:', response.body);

    createdDonationId = response.body.data?.[0]?.DonationID;
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(createdDonationId).toBeDefined();
  });

  it('debería aprobar una donación (PATCH /donation/aproveFriendDonation/:DonationID)', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/donation/aproveFriendDonation/${createdDonationId}`);

    console.log('APROVE DONATION RESPONSE:', response.body);
    expect(response.status).toBeLessThan(500);
    expect(response.body).toHaveProperty('message');
  });

  it('debería denegar una donación (PATCH /donation/denyDonation/:DonationID)', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/donation/denyDonation/${createdDonationId}`)
      .send({ reason: 'No cumple con los requisitos' });

    console.log('DENY DONATION RESPONSE:', response.body);
    expect(response.status).toBeLessThan(500);
    expect(response.body).toHaveProperty('message');
  });

  it('debería confirmar una donación (PATCH /donation/confirmDonation/:DonationID)', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/donation/confirmDonation/${createdDonationId}`)
      .send({ reason: 'Recibido correctamente' });

    console.log('CONFIRM DONATION RESPONSE:', response.body);
    expect(response.status).toBeLessThan(500);
    expect(response.body).toHaveProperty('message');
  });
});
