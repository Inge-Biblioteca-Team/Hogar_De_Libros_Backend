/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { getRoomDto } from './dto/get-pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { Role } from 'src/user/user.entity';

@ApiTags('rooms')
@Controller('rooms')
@UseGuards(AuthGuard, RolesGuard)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @Roles(Role.Admin, Role.Creator)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: '../assets/Rooms',
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  async create(
    @Body() createRoomDto: CreateRoomDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ message: string; roomID?: number }> {
    if (file) {
      const baseUrl = 'http://localhost:3000';
      const filePath = `${baseUrl}/assets/Rooms/${file.filename}`;
      createRoomDto.image = [filePath];
    }
    return this.roomsService.create(createRoomDto);
  }

  @Get()
  @Roles(Role.Admin, Role.Creator, Role.ExternalUser, Role.Reception)
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Retrieved all rooms with pagination',
  })
  async findAllRooms(
    @Query() filter: getRoomDto,
  ): Promise<{ data: CreateRoomDto[]; count: number }> {
    return this.roomsService.findAllRooms(filter);
  }

  @Get('table')
  @Roles(Role.Admin, Role.Creator)
  async findAllRoomsTable(): Promise<CreateRoomDto[]> {
    return this.roomsService.findAllRoomsTable();
  }

  @Get(':id')
  @Roles(Role.Admin, Role.Creator)
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.Admin, Role.Creator)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: '../assets/Rooms',
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateRoomDto: UpdateRoomDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ message: string }> {
    if (file) {
      const baseUrl = 'http://localhost:3000';
      const filePath = `${baseUrl}/assets/Rooms/${file.filename}`;
      updateRoomDto.image = [filePath];
    }
    return this.roomsService.update(+id, updateRoomDto);
  }

  @Patch('maintenance/:id')
  @Roles(Role.Admin)
  async updateStatusMaintenance(
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    return this.roomsService.updateStatusMaintenance(+id);
  }

  @Patch('closed/:id')
  @Roles(Role.Admin)
  async updateStatusClosed(
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    return this.roomsService.updateStatusClosed(+id);
  }

  @Patch('available/:id')
  @Roles(Role.Admin)
  async updateStatusAvailable(
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    return this.roomsService.updateStatusAvailable(+id);
  }
}
