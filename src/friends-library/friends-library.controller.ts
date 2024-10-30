/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FriendsLibraryService } from './friends-library.service';

import { ApiTags } from '@nestjs/swagger';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CreateFriendDTO } from './DTO/create-friend-library-DTO';
import { GetAllFriendsFilterDTO } from './DTO/get-filter-friendLibrary.Dto';
import { DenyFriendRequestDTO } from './DTO/deny-friend-library.Dto';
import { UpdateFriendDTO } from './DTO/update-friend-library-DTO';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { Role } from 'src/user/user.entity';

@ApiTags('friends-library')
@Controller('friends-library')
@UseGuards(AuthGuard, RolesGuard)
export class FriendsLibraryController {
  constructor(private friendService: FriendsLibraryService) {}

  @Post()
  @Roles(Role.Admin, Role.Creator, Role.ExternalUser, Role.Reception)
  @UseInterceptors(AnyFilesInterceptor())
  async CreateFriend(
    @Body() createFriendLibraryDto: CreateFriendDTO,
    @UploadedFiles() files?: Express.Multer.File[],
  ): Promise<{ message: string }> {
    const documents = files || [];

    return this.friendService.CreateFriend(createFriendLibraryDto, documents);
  }

  @Get()
  @Roles(Role.Admin, Role.Creator)
  async getAllFriends(
    @Query(ValidationPipe) filterDTO: GetAllFriendsFilterDTO,
  ) {
    return await this.friendService.getAllFriends(filterDTO);
  }

  @Patch('aproveFriendLibrary/:FriendID')
  @Roles(Role.Admin)
  async aproveFriendLibrary(
    @Param('FriendID') FriendID: number,
  ): Promise<{ message: string }> {
    return this.friendService.aproveFriendLibrary(FriendID);
  }

  @Patch('denyFriendLibrary/:FriendID')
  @Roles(Role.Admin)
  async denyFriendLibrary(
    @Param('FriendID') FriendID: number,
    @Body() dto: DenyFriendRequestDTO,
  ): Promise<{ message: string }> {
    return this.friendService.denyFriendLibrary(FriendID, dto);
  }

  @Patch('downFriendLibrary/:FriendID')
  @Roles(Role.Admin)
  async downFriendLibrary(
    @Param('FriendID') FriendID: number,
    @Body() dto: DenyFriendRequestDTO,
  ): Promise<{ message: string }> {
    return this.friendService.downFriendLibrary(FriendID, dto);
  }

  @Patch('Edit-Friend/:FriendID')
  @Roles(Role.Admin, Role.Creator, Role.ExternalUser)
  async editFriendLibrary(
    @Param('FriendID') FriendID: number,
    @Body() dto: UpdateFriendDTO,
  ): Promise<{ message: string }> {
    return this.friendService.editFriendLibrary(FriendID, dto);
  }
}
