/* eslint-disable prettier/prettier */
import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Role, User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './DTO/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './DTO/update-user.dto';
import { FindAllUsersDto } from './DTO/GetPaginatedDTO';
import { UpdatePasswordDto } from './DTO/UpdatePassDTO';
import { UserDto } from './DTO/UserInfo';

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

  async create(createUserDto: CreateUserDto): Promise<{ message: string }> {
    const { email, cedula, password } = createUserDto;

    try {
      const existingUser = await this.UserRepository.findOne({
        where: [{ email }, { cedula }],
      });

      if (existingUser) {
        if (existingUser.email === email) {
          throw new HttpException(
            'El correo electrónico ya está registrado por favor intente con otro.',
            HttpStatus.CONFLICT,
          );
        }

        if (existingUser.cedula === cedula) {
          throw new HttpException(
            'Ya existe un usuario con la cédula ingresada.',
            HttpStatus.CONFLICT,
          );
        }
      }

      const saltOrRounds = 10;
      const hash = await bcrypt.hash(password, saltOrRounds);
      const newUser = this.UserRepository.create(createUserDto);
      newUser.password = hash;
      newUser.status = true;
      await this.UserRepository.save(newUser);

      return { message: 'Se ha registrado exitosamente' };
    } catch (error) {
      const errorMessage = (error as Error).message || 'Error al registrar';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async update(
    cedula: string,
    updateUserDto: UpdateUserDto,
  ): Promise<{ message: string }> {
    console.log(updateUserDto)
    try {
      const user = await this.UserRepository.findOneBy({ cedula });
      if (!user)
        throw new HttpException(
          `Usuario con cédula ${cedula} no encontrado`,
          HttpStatus.NOT_FOUND,
        );
      await this.UserRepository.update(cedula, updateUserDto);
      await this.UserRepository.findOneBy({ cedula });
      return { message: 'El usuario ha sido actualizado con éxito' };
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al actualizar el usuario';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async changeStatus(cedula: string): Promise<{ message: string }> {
    try {
      const user = await this.UserRepository.findOneBy({ cedula });

      if (!user) {
        throw new HttpException(
          `Usuario con cédula ${cedula} no encontrado`,
          HttpStatus.NOT_FOUND,
        );
      }

      user.status = !user.status;
      await this.UserRepository.save(user);
      return { message: 'El estado del usuario ha sido actualizado con éxito' };
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al actualizar el estado del usuario';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async UPStatus(cedula: string) {
    try {
      const user = await this.UserRepository.findOneBy({ cedula });

      if (!user) {
        throw new HttpException(
          `Usuario con cédula ${cedula} no encontrado`,
          HttpStatus.NOT_FOUND,
        );
      }

      user.status = user.status = true;
      await this.UserRepository.save(user);
      return { message: 'El  usuario ha sido habilitado con éxito' };
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al habilitar el usuario';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async getUserByCedula(cedula: string): Promise<UserDto> {
    const baseUrl = process.env.BASE_URL;

    const user = await this.UserRepository.findOne({ where: { cedula } });

    if (!user) {
      throw new HttpException(
        `Usuario con cédula ${cedula} no encontrado`,
        HttpStatus.NOT_FOUND,
      );
    }

    delete user.password;

    const today = new Date();
    const birthDateObj = new Date(user.birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const month = today.getMonth() - birthDateObj.getMonth();

    if (
      month < 0 ||
      (month === 0 && today.getDate() < birthDateObj.getDate())
    ) {
      age--;
    }

    const genderAbbreviation =
      user.gender === 'Mujer' ? 'M' : user.gender === 'Hombre' ? 'H' : 'Other';
    const ageCategory = age < 18 ? 'J' : age < 40 ? 'A' : 'C';

    const imageUrl = `${baseUrl}/assets/ProfileImg/${genderAbbreviation}${ageCategory}.webp`;

    return { ...user, imageUrl };
  }

  async updatePassword(
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<{ message: string }> {
    try {
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
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al actualizar la contraseña';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async getAdminList() {
    const data = await this.UserRepository.find({
      where: {
        role: Role.Admin,
        status: true,
      },
    });

    return data.map(({ cedula, name, lastName }) => ({
      cedula,
      name: lastName ? `${name} ${lastName}` : name,
    }));
  }
}
