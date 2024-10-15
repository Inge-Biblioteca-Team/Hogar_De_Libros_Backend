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
import { CreateFriendDTO } from './DTO/create-friend-libary-DTO';

@ApiTags('friends-library')
@Controller('friends-library')
export class FriendsLibraryController {
  constructor(private friendService: FriendsLibraryService) {}

  @Post('')
  @UseInterceptors(FilesInterceptor('document', 10))
  async CreateFriend(
    @Body() createFriendLibraryDto: CreateFriendDTO,
    @UploadedFiles() documents: Express.Multer.File[],
  ) {
    return this.friendService.CreateFriend(createFriendLibraryDto, documents);
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
