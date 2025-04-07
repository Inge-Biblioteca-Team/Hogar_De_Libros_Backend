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

  it('debería crear un amigo de la biblioteca (POST /friends-library)', async () => {
    const friendDto = {
      UserFullName: 'María González',
      UserCedula: '123456789',
      UserBirthDate: '2000-01-01',
      UserGender: 'Mujer',
      UserAddress: 'Calle 123',
      UserPhone: '88888888',
      UserEmail: 'maria@example.com',
      PrincipalCategory: 'Educación',
      SubCategory: 'Voluntariado'
    };

    const createResponse = await request(app.getHttpServer())
      .post('/friends-library')
      .send(friendDto);

    console.log('CREATE FRIEND RESPONSE:', createResponse.body);
    expect(createResponse.status).toBeLessThan(500);
    expect(createResponse.body).toHaveProperty('message');

    const listResponse = await request(app.getHttpServer()).get('/friends-library?page=1&limit=10');
    console.log('LIST FRIENDS RESPONSE:', listResponse.body);

    createdFriendId = listResponse.body.data?.[0]?.FriendId;
    expect(createdFriendId).toBeDefined();
  });

  it('debería aprobar la solicitud (PATCH /friends-library/aproveFriendLibrary/:FriendID)', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/friends-library/aproveFriendLibrary/${createdFriendId}`);

    console.log('APROVE RESPONSE:', response.body);
    expect(response.status).toBeLessThan(500);
    expect(response.body).toHaveProperty('message');
  });

  it('debería editar la solicitud (PATCH /friends-library/Edit-Friend/:FriendID)', async () => {
    const editDto = {
      UserFullName: 'María González Actualizada'
    };

    const response = await request(app.getHttpServer())
      .patch(`/friends-library/Edit-Friend/${createdFriendId}`)
      .send(editDto);

    console.log('EDIT RESPONSE:', response.body);
    expect(response.status).toBeLessThan(500);
    expect(response.body).toHaveProperty('message');
  });
});
