import { PartialType } from '@nestjs/swagger';
import { CreateOrUpdateFriendLibraryDTO } from './create-friend-libary-DTO';


export class UpdateFriendLibraryDTO extends PartialType(
  CreateOrUpdateFriendLibraryDTO,
) {}
