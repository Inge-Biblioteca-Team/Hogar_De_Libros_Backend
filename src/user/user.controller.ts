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
  @Roles('admin', 'asistente')
  async findAll(@Query() query: FindAllUsersDto) {
    return this.userService.findAll(query);
  }

  @Get(':cedula')
  @UseGuards(AuthGuard)
  async getUserByCedula(@Param('cedula') cedula: string) {
    return await this.userService.getUserByCedula(cedula);
  }
  // PROMISE MESSAGE
  @Patch('update/:cedula')
  @UseGuards(AuthGuard)
  async updateUser(
    @Param('cedula') cedula: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(cedula, updateUserDto);
  }
  // PROMISE MESSAGE
  @Patch('change-status/:cedula')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async changeUserStatus(@Param('cedula') cedula: string) {
    return await this.userService.changeStatus(cedula);
  }
  // PROMISE MESSAGE
  @Patch('UP-status/:cedula')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async changeUserStatusUP(@Param('cedula') cedula: string) {
    return await this.userService.UPStatus(cedula);
  }

  @Patch('update-password')
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<{ message: string }> {
    return await this.userService.updatePassword(updatePasswordDto);
  }
}
