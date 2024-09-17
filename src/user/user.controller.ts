/* eslint-disable prettier/prettier */
import { Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { CreateUserDto } from './DTO/create-user.dto';
import { UpdateUserDto } from './DTO/update-user.dto';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(private readonly userService:UserService){}
    @Post()
    create(@Body() createUserDto: CreateUserDto){
        return this.userService.create(createUserDto)
    }

    @Get()
    findAll(){
        return this.userService.findAll();
    }

    @Get(':cedula')
  async getUserByCedula(@Param('cedula') cedula: string) {
    const user = await this.userService.getUserByCedula(cedula);
    if (!user) {
      throw new HttpException(`User with cedula ${cedula} not found`, HttpStatus.NOT_FOUND);
    }
    return user;
  }

   
  @Patch('update/:cedula')
  async updateUser(@Param('cedula') cedula: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      return await this.userService.update(cedula, updateUserDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
    @Patch('change-status/:cedula')
  async changeUserStatus(@Param('cedula') cedula: string) {
    try {
      return await this.userService.changeStatus(cedula);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }


}
