import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './DTO/create-user.dto';
import { UpdateUserDto } from './DTO/update-user.dto';
import { FindAllUsersDto } from './DTO/GetPaginatedDTO';
import { UpdatePasswordDto } from './DTO/UpdatePassDTO';
import * as bcrypt from 'bcrypt';
import { Role } from './loan-policy';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const query: FindAllUsersDto = { page: 1, limit: 10 };
      const users = [{ name: 'John' }] as User[];
      jest.spyOn(userRepository, 'createQueryBuilder').mockReturnValue({
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([users, 1]),
      } as any);

      const result = await service.findAll(query);
      expect(result).toEqual({ data: users, count: 1 });
    });
  });

  describe('create', () => {
    it('should throw conflict if email or cedula already exists', async () => {
      const createUserDto: CreateUserDto = {
        cedula: '12345678',
      email: 'test@example.com',
      name: 'John',
      lastName: 'Doe',
      phoneNumber: '555-1234',
      province: 'Test Province',
      district: 'Test District',
      gender: 'Male',
      address: '123 Test St',
      birthDate: new Date('1990-01-01'),
      password: 'password',
      acceptTermsAndConditions: true,
      role: Role.Viewer,
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue({} as User);

      await expect(service.create(createUserDto)).rejects.toThrow(
        new HttpException(
          'El correo electrónico ya está registrado.',
          HttpStatus.CONFLICT,
        ),
      );
    });

    it('should create a new user and hash the password', async () => {
      const createUserDto: CreateUserDto = {
        cedula: '12345678',
        email: 'test@example.com',
        name: 'John',
        lastName: 'Doe',
        phoneNumber: '555-1234',
        province: 'Test Province',
        district: 'Test District',
        gender: 'Male',
        address: '123 Test St',
        birthDate: new Date('1990-01-01'),
        password: 'password',
        acceptTermsAndConditions: true,
        role: Role.Viewer,
      };

      it('should throw conflict if email or cedula already exists', async () => {
        jest.spyOn(userRepository, 'findOne').mockResolvedValue({} as User);
  
        await expect(service.create(createUserDto)).rejects.toThrow(
          new HttpException(
            'El correo electrónico ya está registrado.',
            HttpStatus.CONFLICT,
          ),
        );
      });
  
      it('should create a new user and hash the password', async () => {
        const hashedPassword = 'hashedPassword'; // Declarar la variable hashedPassword
  
        // Simulamos la función bcrypt.hash para devolver el valor 'hashedPassword'
        const hashSpy = jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve(hashedPassword));
        
        jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
        jest.spyOn(userRepository, 'create').mockReturnValue(createUserDto as any);
        jest.spyOn(userRepository, 'save').mockResolvedValue({
          ...createUserDto,
          password: hashedPassword, // Asignar el valor de hashedPassword aquí
        } as any);
  
        const result = await service.create(createUserDto);
        
        // Verificamos que bcrypt.hash fue llamado con los parámetros correctos
        expect(hashSpy).toHaveBeenCalledWith('password', 10);
  
        // Verificamos que la contraseña haya sido correctamente hasheada
        expect(result.password).toBe(hashedPassword); // Usar hashedPassword aquí
      });
    });
  
  describe('update', () => {
    it('should throw not found if the user does not exist', async () => {
      const updateUserDto: UpdateUserDto = {cedula: '12345678',
        email: 'newemail@example.com',
        name: 'Updated Name',
        lastName: 'Updated Last Name',
        phoneNumber: '555-5678',
        province: 'Updated Province',
        district: 'Updated District',
        gender: 'Female',
        address: 'Updated Address',
        birthDate: new Date('1991-02-01'), };
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.update('123456789', updateUserDto)).rejects.toThrow(
        new HttpException('Area with cedula 123456789 not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should update an existing user', async () => {
      const updateUserDto: UpdateUserDto = {cedula: '12345678',email: 'newemail@example.com',
        name: 'Updated Name',
        lastName: 'Updated Last Name',
        phoneNumber: '555-5678',
        province: 'Updated Province',
        district: 'Updated District',
        gender: 'Female',
        address: 'Updated Address',
        birthDate: new Date('1991-02-01'), };
      const existingUser = { cedula: '123456789', name: 'Old Name' } as User;
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(existingUser);
      jest.spyOn(userRepository, 'update').mockResolvedValue(null);
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(existingUser);

      const result = await service.update('123456789', updateUserDto);
      expect(result).toEqual(existingUser);
    });
  });

  describe('changeStatus', () => {
    it('should throw not found if the user does not exist', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.changeStatus('123456789')).rejects.toThrow(
        new HttpException('user with cedula 123456789 not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should toggle the user status', async () => {
      const existingUser = { cedula: '123456789', status: true } as User;
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(existingUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(existingUser);

      const result = await service.changeStatus('123456789');
      expect(result.status).toBe(false);
    });
  });
  describe('updatePassword', () => {
    const updatePasswordDto: UpdatePasswordDto = {
      cedula: '123456789',
      newPassword: 'newpassword',
    };

    it('should throw not found if the user does not exist', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.updatePassword(updatePasswordDto)).rejects.toThrow(
        new HttpException('Usuario no encontrado.', HttpStatus.NOT_FOUND),
      );
    });

    it('should update the user password and hash it successfully', async () => {
      const existingUser = { cedula: '123456789', password: 'oldpassword' } as User;
      const hashedPassword = 'hashedPassword'; // Valor simulado de bcrypt.hash

      // Simular la búsqueda del usuario en el repositorio
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(existingUser);

      // Simular el comportamiento de bcrypt.hash
      const hashSpy = jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve(hashedPassword));

      // Simular la actualización del usuario
      jest.spyOn(userRepository, 'save').mockResolvedValue(existingUser);

      const result = await service.updatePassword(updatePasswordDto);

      // Verificar que bcrypt.hash fue llamado con la nueva contraseña
      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 10);
      
      // Verificar que el password del usuario se actualizó correctamente
      expect(existingUser.password).toBe(hashedPassword);

      // Verificar que el mensaje de éxito es el esperado
      expect(result.message).toBe('Contraseña actualizada con éxito');
    });
  });
});
});

