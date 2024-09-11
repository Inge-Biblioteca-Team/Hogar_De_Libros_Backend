/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './DTO/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './DTO/update-user.dto';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly UserRepository: Repository<User>,
      ) {}

      async findAll() {
        return await this.UserRepository.find();
      }
    
      async findOne(email: string) {
        return this.UserRepository.findOne({ where: { email } });
      }
    
      async create(createUserDto: CreateUserDto) {
    
        const saltOrRounds = 10;
        const password = createUserDto.password;
        const hash = await bcrypt.hash(password, saltOrRounds);
        const newUser = this.UserRepository.create(createUserDto);
        newUser.password = hash;
        newUser.status = true;
        return await this.UserRepository.save(newUser)
    
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
}
