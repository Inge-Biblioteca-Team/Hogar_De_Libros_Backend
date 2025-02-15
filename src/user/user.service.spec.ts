import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Role, User } from './user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './DTO/create-user.dto';

const mockUserRepository = {
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    andWhere: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
  }),
};

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
  it('debería devolver un usuario por email', async () => {
    const user: User = {
      email: 'test@example.com',
      cedula: '123456789',
      password: 'password123',
      name: 'Test',
      lastName: 'User',
    } as User;

    jest.spyOn(repository, 'findOne').mockImplementation(async () => user);

    const result = await service.findOne('test@example.com');
    expect(result).toEqual(user);
  });

  it('debería devolver null si no se encuentra el usuario', async () => {
    jest.spyOn(repository, 'findOne').mockImplementation(async () => null);

    const result = await service.findOne('notfound@example.com');
    expect(result).toBeNull();
  });
});

describe('create', () => {
  it('debería crear un usuario nuevo', async () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      cedula: '123456789',
      password: 'password123',
      name: 'Test',
      lastName: 'User',
      phoneNumber: '',
      province: '',
      district: '',
      gender: '',
      address: '',
      birthDate: undefined,
      acceptTermsAndConditions: false,
      role: Role.ExternalUser
    };

    const newUser = {
      ...createUserDto,
      status: true,
      password: 'hashedPassword',
    } as User;

    jest.spyOn(repository, 'findOne').mockImplementation(async () => null);
    jest.spyOn(repository, 'create').mockReturnValue(newUser);
    jest.spyOn(repository, 'save').mockImplementation(async () => newUser);
    jest.spyOn(bcrypt, 'hash').mockImplementation(async () => 'hashedPassword');

    const result = await service.create(createUserDto);

    expect(result).toEqual({ message: 'Se ha registrado exitosamente' });
    expect(repository.create).toHaveBeenCalledWith(createUserDto);
    expect(repository.save).toHaveBeenCalledWith(newUser);
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
  });

  it('debería lanzar un error si el email ya está registrado', async () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      cedula: '123456789',
      password: 'password123',
      name: 'Test',
      lastName: 'User',
      phoneNumber: '',
      province: '',
      district: '',
      gender: '',
      address: '',
      birthDate: undefined,
      acceptTermsAndConditions: false,
      role: Role.ExternalUser
    };

    const existingUser = { email: 'test@example.com' } as User;

    jest.spyOn(repository, 'findOne').mockImplementation(async () => existingUser);

    await expect(service.create(createUserDto)).rejects.toThrow(
      'El correo electrónico ya está registrado por favor intente con otro.',
    );
  });

  it('debería lanzar un error si la cédula ya está registrada', async () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      cedula: '123456789',
      password: 'password123',
      name: 'Test',
      lastName: 'User',
      phoneNumber: '',
      province: '',
      district: '',
      gender: '',
      address: '',
      birthDate: undefined,
      acceptTermsAndConditions: false,
      role: Role.ExternalUser
    };

    const existingUser = { cedula: '123456789' } as User;

    jest.spyOn(repository, 'findOne').mockImplementation(async () => existingUser);

    await expect(service.create(createUserDto)).rejects.toThrow(
      'Ya existe un usuario con la cedula ingresada.',
    );
  });

  it('debería lanzar un error en caso de fallo en la BD', async () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      cedula: '123456789',
      password: 'password123',
      name: 'Test',
      lastName: 'User',
      phoneNumber: '',
      province: '',
      district: '',
      gender: '',
      address: '',
      birthDate: undefined,
      acceptTermsAndConditions: false,
      role: Role.ExternalUser
    };

    jest.spyOn(repository, 'findOne').mockImplementation(async () => null);
    jest.spyOn(repository, 'create').mockReturnValue({} as User);
    jest.spyOn(repository, 'save').mockImplementation(async () => {
      throw new Error('Error en la base de datos');
    });

    await expect(service.create(createUserDto)).rejects.toThrow(
      'Error en la base de datos',
    );
  });
});


 
});
