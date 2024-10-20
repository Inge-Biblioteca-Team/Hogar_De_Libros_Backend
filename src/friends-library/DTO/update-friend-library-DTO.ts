import { PartialType } from '@nestjs/swagger';
import { CreateFriendDTO } from './create-friend-library-DTO';

export class UpdateFriendDTO extends PartialType(CreateFriendDTO) {}
