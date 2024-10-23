/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FriendsLibraryService } from './friends-library.service';

import { ApiTags } from '@nestjs/swagger';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CreateFriendDTO } from './DTO/create-friend-library-DTO';
import { GetAllFriendsFilterDTO } from './DTO/get-filter-friendLibrary.Dto';

@ApiTags('friends-library')
@Controller('friends-library')
export class FriendsLibraryController {
  constructor(private friendService: FriendsLibraryService) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async CreateFriend(
    @Body() createFriendLibraryDto: CreateFriendDTO,
    @UploadedFiles() files?: Express.Multer.File[],
  ): Promise<{ message: string }> {
    const documents = files || [];

    return this.friendService.CreateFriend(createFriendLibraryDto, documents);
  }

  @Get()
  async getAllFriends(@Query(ValidationPipe) filterDTO: GetAllFriendsFilterDTO) {
    return await this.friendService.getAllFriends(filterDTO);
  }

  @Patch('aproveFriendLibrary/:FriendID')
  async aproveFriendLibrary(
    @Query('FriendID') FriendID: number,
  ): Promise<{ message: string }> {
    return this.friendService.aproveFriendLibrary(FriendID);
  }

  @Patch('denyFriendLibrary/:FriendID')
  async denyFriendLibrary(
    @Query('FriendID') FriendID: number,
  ): Promise<{ message: string }> {
    return this.friendService.denyFriendLibrary(FriendID);
  }
}
