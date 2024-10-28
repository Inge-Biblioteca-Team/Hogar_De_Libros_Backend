/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './DTO/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './DTO/update-user.dto';
import { Role } from './loan-policy';
import { FindAllUsersDto } from './DTO/GetPaginatedDTO';
import { UpdatePasswordDto } from './DTO/UpdatePassDTO';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly UserRepository: Repository<User>,
  ) {}

  async findAll(query: FindAllUsersDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.UserRepository.createQueryBuilder('user');

    if (query.name) {
      queryBuilder.andWhere('user.name LIKE :name', {
        name: `%${query.name}%`,
      });
    }

    if (query.cedula) {
      queryBuilder.andWhere('user.cedula = :cedula', { cedula: query.cedula });
    }

    if (query.role) {
      queryBuilder.andWhere('user.role = :role', { role: query.role });
    }

    if (query.registerDate) {
      const year = parseInt(query.registerDate, 10);

      queryBuilder.andWhere('YEAR(user.registerDate) = :year', { year });
    }

    const [data, count] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      count,
    };
  }

  async findOne(email: string) {
    return this.UserRepository.findOne({ where: { email } });
  }
  async findCedula(cedula: string) {
    return this.UserRepository.findOne({ where: { cedula } });
  }

  async findUser(email: string, cedula: string): Promise<User | null> {
    return await this.UserRepository.findOne({
      where: { email, cedula },
    });
  }

  async create(createUserDto: CreateUserDto) {
    const { email, cedula, password } = createUserDto;

    const existingUser = await this.UserRepository.findOne({
      where: [{ email }, { cedula }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new HttpException(
          'El correo electrónico ya está registrado.',
          HttpStatus.CONFLICT,
        );
      }

      if (existingUser.cedula === cedula) {
        throw new HttpException(
          'Error durante el registro revise sus datos.',
          HttpStatus.CONFLICT,
        );
      }
    }

    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    const newUser = this.UserRepository.create(createUserDto);
    newUser.password = hash;
    newUser.status = true;

    return await this.UserRepository.save(newUser);
  }

  async createExternalUser(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.role = Role.ExternalUser;

    return await this.create(createUserDto);
  }

  async createViewerUser(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.role = Role.Viewer;

    return await this.create(createUserDto);
  }

  async createCreatorUser(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.role = Role.Creator;

    return await this.create(createUserDto);
  }
  async update(cedula: string, updateUserDto: UpdateUserDto) {
    const user = await this.UserRepository.findOneBy({ cedula });
    if (!user)
      throw new HttpException(
        `Area with cedula ${cedula} not found`,
        HttpStatus.NOT_FOUND,
      );
    await this.UserRepository.update(cedula, updateUserDto);
    return await this.UserRepository.findOneBy({ cedula });
  }

  async changeStatus(cedula: string) {
    const user = await this.UserRepository.findOneBy({ cedula });

    if (!user) {
      throw new HttpException(
        `user with cedula ${cedula} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    user.status = !user.status;
    return await this.UserRepository.save(user);
  }
  async UPStatus(cedula: string) {
    const user = await this.UserRepository.findOneBy({ cedula });

    if (!user) {
      throw new HttpException(
        `user with cedula ${cedula} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    user.status = user.status = true;
    return await this.UserRepository.save(user);
  }

  async getUserByCedula(cedula: string): Promise<User> {
    const user = await this.UserRepository.findOne({ where: { cedula } });

    if (!user) {
      throw new HttpException(
        `Usuario con cédula ${cedula} no encontrado`,
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  async updatePassword(
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<{ message: string }> {
    const cedula = updatePasswordDto.cedula;

    const user = await this.UserRepository.findOne({ where: { cedula } });

    if (!user) {
      throw new HttpException('Usuario no encontrado.', HttpStatus.NOT_FOUND);
    }

    const password = updatePasswordDto.newPassword;

    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    user.password = hash;
    await this.UserRepository.save(user);

    return { message: 'Contraseña actualizada con éxito' };
  }
}
