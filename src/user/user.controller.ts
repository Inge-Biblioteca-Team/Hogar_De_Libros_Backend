/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
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

    @Patch(':id')
    update(@Param('id') id:string, @Body() updateUserDto:UpdateUserDto){
        return this.userService.update(+id, updateUserDto)
    }

    @Patch('status/:id')
    changeStatus(@Param('id') id:string){
        return this.userService.changeStatus(+id);
    }
}
