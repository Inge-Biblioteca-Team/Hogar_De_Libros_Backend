import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { DataSource } from 'typeorm';

jest.setTimeout(30000);

describe('CollaboratorController (Integration)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let createdCollaboratorId: number;

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

  it('debería crear un colaborador (POST /collaborator)', async () => {
    const collaboratorDto = {
      UserFullName: 'Juan Pérez',
      Entitycollaborator: 'MEP',
      UserCedula: '123456789',
      UserBirthDate: '1990-01-01',
      UserGender: 'Hombre',
      UserAddress: 'Dirección de prueba',
      UserPhone: '88889999',
      UserEmail: 'juan@example.com',
      PrincipalCategory: 'Capacitación',
      SubCategory: 'Emprendimiento',
      Experience: 'Docente de tecnología',
      ExtraInfo: 'Experiencia en redes',
      activityDate: new Date('2025-05-01'),
      Description: 'Clases de computación',
      Document: []
    };

    const response = await request(app.getHttpServer())
      .post('/collaborator')
      .send(collaboratorDto);

    console.log('CREATE COLLABORATOR RESPONSE:', response.body);
    expect(response.status).toBeLessThan(500);
    expect(response.body).toHaveProperty('message');
  });

  it('debería obtener todos los colaboradores (GET /collaborator)', async () => {
    const response = await request(app.getHttpServer()).get('/collaborator?page=1&limit=10');
    console.log('LIST COLLABORATORS RESPONSE:', response.body);

    createdCollaboratorId = response.body.data?.[0]?.CollaboratorId;
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(createdCollaboratorId).toBeDefined();
  });

  it('debería aprobar un colaborador (PATCH /collaborator/aproveCollaborator/:id)', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/collaborator/aproveCollaborator/${createdCollaboratorId}`);

    console.log('APROVE COLLABORATOR RESPONSE:', response.body);
    expect(response.status).toBeLessThan(500);
    expect(response.body).toHaveProperty('message');
  });

  it('debería rechazar un colaborador (PATCH /collaborator/denyCollaborator/:id)', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/collaborator/denyCollaborator/${createdCollaboratorId}`)
      .send({ reason: 'No cumple requisitos', Id: createdCollaboratorId });

    console.log('DENY COLLABORATOR RESPONSE:', response.body);
    expect(response.status).toBeLessThan(500);
    expect(response.body).toHaveProperty('message');
  });

  it('debería cancelar un colaborador (PATCH /collaborator/cancelCollaborator/:id)', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/collaborator/cancelCollaborator/${createdCollaboratorId}`)
      .send({ reason: 'Cancelado por cambios internos', Id: createdCollaboratorId });

    console.log('CANCEL COLLABORATOR RESPONSE:', response.body);
    expect(response.status).toBeLessThan(500);
    expect(response.body).toHaveProperty('message');
  });

  it('debería editar un colaborador (PATCH /collaborator/Edit-Collaborator/:id)', async () => {
    const updateDto = {
      Experience: 'Actualizado: Experiencia en administración',
      Description: 'Apoyo en charlas de emprendimiento'
    };

    const response = await request(app.getHttpServer())
      .patch(`/collaborator/Edit-Collaborator/${createdCollaboratorId}`)
      .send(updateDto);

    console.log('EDIT COLLABORATOR RESPONSE:', response.body);
    expect(response.status).toBeLessThan(500);
    expect(response.body).toHaveProperty('message');
  });
});
