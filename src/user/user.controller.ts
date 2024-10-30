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
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './DTO/create-user.dto';
import { UpdateUserDto } from './DTO/update-user.dto';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { FindAllUsersDto } from './DTO/GetPaginatedDTO';
import { UpdatePasswordDto } from './DTO/UpdatePassDTO';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { Role } from './user.entity';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<{ message: string }> {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Creator, Role.ExternalUser,Role.Reception)
  async findAll(@Query() query: FindAllUsersDto) {
    return this.userService.findAll(query);
  }

  @Get(':cedula')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Creator)
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
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Creator, Role.ExternalUser,Role.Reception)
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
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
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
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
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
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Creator, Role.ExternalUser,Role.Reception)
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
