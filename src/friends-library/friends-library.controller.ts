import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FriendsLibraryService } from './friends-library.service';

import { ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateOrUpdateFriendLibraryDTO } from './DTO/create-friend-libary-DTO';

@ApiTags('friends-library')
@Controller('friends-library')
export class FriendsLibraryController {
  constructor(private friendService: FriendsLibraryService) {}

  @Post('create-or-update')
  @UseInterceptors(FilesInterceptor('document', 10)) // 'Document' es la clave usada en Postman para los archivos
  async createOrUpdateFriendLibrary(
    @Body() createFriendLibraryDto: CreateOrUpdateFriendLibraryDTO,
    @UploadedFiles() documents: Express.Multer.File[], // Manejar múltiples archivos
  ) {
    return this.friendService.createOrUpdateFriendLibrary(createFriendLibraryDto, documents);
  }

  @Get()
  async getAllFriendsLibrary() {
    return this.friendService.getAllFriendsLibrary();
  }

  @Patch('aproveFriendLibrary/:cedula')
  async aproveFriendLibrary(@Query('cedula') cedula: string) {
    return this.friendService.aproveFriendLibrary(cedula);
  }
}