/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './DTO/create-user.dto';
import { UpdateUserDto } from './DTO/update-user.dto';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { FindAllUsersDto } from './DTO/GetPaginatedDTO';
import { UpdatePasswordDto } from './DTO/UpdatePassDTO';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<{ message: string }> {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll(@Query() query: FindAllUsersDto) {
    return this.userService.findAll(query);
  }

  @Get(':cedula')
  async getUserByCedula(@Param('cedula') cedula: string) {
    const user = await this.userService.getUserByCedula(cedula);
    if (!user) {
      throw new HttpException(
        `User with cedula ${cedula} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  @Patch('update/:cedula')
  async updateUser(
    @Param('cedula') cedula: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      return await this.userService.update(cedula, updateUserDto);
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new HttpException(errorMessage, HttpStatus.NOT_FOUND);
    }
  }

  @Patch('change-status/:cedula')
  async changeUserStatus(@Param('cedula') cedula: string) {
    try {
      return await this.userService.changeStatus(cedula);
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new HttpException(errorMessage, HttpStatus.NOT_FOUND);
    }
  }

  @Patch('UP-status/:cedula')
  async changeUserStatusUP(@Param('cedula') cedula: string) {
    try {
      return await this.userService.UPStatus(cedula);
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new HttpException(errorMessage, HttpStatus.NOT_FOUND);
    }
  }

  @Patch('update-password')
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<{ message: string }> {
    try {
      const result = await this.userService.updatePassword(updatePasswordDto);
      return result;
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }
  }
}
