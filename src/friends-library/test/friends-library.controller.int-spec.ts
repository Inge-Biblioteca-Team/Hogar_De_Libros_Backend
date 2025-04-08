import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { DataSource } from 'typeorm';

jest.setTimeout(30000);

describe('FriendsLibraryController (Integration)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let createdFriendId: number;

  const friendDto = {
    UserFullName: 'Ana María Gómez',
    UserCedula: '123456789',
    UserBirthDate: '1990-01-01',
    UserGender: 'Femenino',
    UserAddress: 'Calle Principal 45',
    UserPhone: '88881234',
    UserEmail: 'ana@example.com',
    PrincipalCategory: 'Voluntariado',
    SubCategory: 'Donación'
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

  it('debería crear un amigo de la biblioteca (POST /friends-library)', async () => {
    const response = await request(app.getHttpServer())
      .post('/friends-library')
      .send(friendDto);

    console.log('CREATE FRIEND RESPONSE:', response.body);
    expect(response.status).toBeLessThan(500);
    expect(response.body).toHaveProperty('message');
  });


});