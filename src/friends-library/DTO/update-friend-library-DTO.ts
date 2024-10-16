import { PartialType } from '@nestjs/swagger';
import { CreateFriendDTO } from './create-friend-libary-DTO';

export class UpdateFriendDTO extends PartialType(CreateFriendDTO) {}
