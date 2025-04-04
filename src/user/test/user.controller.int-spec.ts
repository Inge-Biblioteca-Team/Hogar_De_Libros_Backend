import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from '../user.entity';


jest.setTimeout(15000);

describe('UserController (Integration)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  const newUser = {
    cedula: '99999999',
    email: 'usuario@test.com',
    name: 'Usuario',
    lastName: 'Prueba',
    phoneNumber: '88889999',
    province: 'San Jose',
    district: 'Catedral',
    gender: 'Masculino',
    address: 'Calle 123',
    birthDate: new Date('2000-01-01'),
    password: 'Password123!',
    acceptTermsAndConditions: true,
    role: Role.ExternalUser,
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
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    await app.init();
    dataSource = app.get(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  beforeEach(async () => {
    await dataSource.query('DELETE FROM users WHERE cedula = ?', [newUser.cedula]);
  });

  it('debería crear un usuario (POST /user)', async () => {
    const response = await request(app.getHttpServer())
      .post('/user')
      .send(newUser);

    console.log('USER CREATION RESPONSE:', response.body);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message');
  });

  it('debería obtener un usuario por cédula (GET /user/:cedula)', async () => {
    await request(app.getHttpServer()).post('/user').send(newUser);

    const response = await request(app.getHttpServer()).get(
      `/user/${newUser.cedula}`,
    );

    expect(response.status).toBe(200);
    expect(response.body.cedula).toBe(newUser.cedula);
  });

  it('debería actualizar el usuario (PATCH /user/update/:cedula)', async () => {
    await request(app.getHttpServer()).post('/user').send(newUser);

    const update = { name: 'Nombre Actualizado' };
    const response = await request(app.getHttpServer())
      .patch(`/user/update/${newUser.cedula}`)
      .send(update);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
  });

  it('debería cambiar el estado del usuario (PATCH /user/change-status/:cedula)', async () => {
    await request(app.getHttpServer()).post('/user').send(newUser);

    const response = await request(app.getHttpServer()).patch(
      `/user/change-status/${newUser.cedula}`,
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
  });

  it('debería volver a activar el usuario (PATCH /user/UP-status/:cedula)', async () => {
    await request(app.getHttpServer()).post('/user').send(newUser);

    const response = await request(app.getHttpServer()).patch(
      `/user/UP-status/${newUser.cedula}`,
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
  });

  it('debería actualizar la contraseña (PATCH /user/update-password)', async () => {
    // Crear el usuario
    const createResponse = await request(app.getHttpServer())
      .post('/user')
      .send(newUser);

    expect(createResponse.status).toBe(201);

    // DTO para actualizar contraseña
    const updatePasswordDto = {
      cedula: newUser.cedula,
      newPassword: 'NuevaPassword456!',
    };

    console.log('SENDING PASSWORD DTO:', updatePasswordDto);

    const response = await request(app.getHttpServer())
      .patch('/user/update-password')
      .send(updatePasswordDto);

    console.log('PASSWORD UPDATE RESPONSE:', response.body);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
  });

});
