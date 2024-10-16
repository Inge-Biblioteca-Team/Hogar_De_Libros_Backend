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
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateFriendDTO } from './DTO/create-friend-libary-DTO';

@ApiTags('friends-library')
@Controller('friends-library')
export class FriendsLibraryController {
  constructor(private friendService: FriendsLibraryService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'document', maxCount: 10 },
      { name: 'image', maxCount: 10 },
    ]),
  )
  async CreateFriend(
    @Body() createFriendLibraryDto: CreateFriendDTO,
    @UploadedFiles()
    files?: { document?: Express.Multer.File[]; image?: Express.Multer.File[] },
  ) {
    const documents = files?.document || [];
    const images = files?.image || [];

    return this.friendService.CreateFriend(
      createFriendLibraryDto,
      documents,
      images,
    );
  }

  @Get()
  async getAllFriendsLibrary() {
    return this.friendService.getAllFriendsLibrary();
  }

  @Patch('aproveFriendLibrary/:FriendID')
  async aproveFriendLibrary(@Query('FriendID') FriendID: number) {
    return this.friendService.aproveFriendLibrary(FriendID);
  }
}
