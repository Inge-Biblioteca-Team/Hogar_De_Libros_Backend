/* eslint-disable prettier/prettier */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendsLibrary } from './friend-library.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { CreateFriendDTO } from './DTO/create-friend-libary-DTO';

@Injectable()
export class FriendsLibraryService {
  constructor(
    @InjectRepository(FriendsLibrary)
    private FriendRepositoy: Repository<FriendsLibrary>,
    @InjectRepository(User) private UserRepository: Repository<User>,
  ) {}

  async CreateFriend(
    dto: CreateFriendDTO,
    documents: Express.Multer.File[], // Recibimos los archivos
  ): Promise<{ message: string }> {
    try {
      const user = await this.UserRepository.findOne({
        where: { cedula: dto.cedula },
      });
      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }
      const newFriend = this.FriendRepositoy.create({
        user,
        PrincipalCategory: dto.principalCategory,
        SubCategory: dto.subCategory,
        Document: dto.document,
        Image: dto.image,
        DateRecolatedDonation: dto.DateRecolatedDonation,
      });

      if (documents && documents.length > 0) {
        newFriend.Document = documents.map((file) => file.filename);
      }

      await this.FriendRepositoy.save(newFriend);
      return { message: 'Se ha enviado la solicitud correctamente' };
    } catch (error) {
      throw new InternalServerErrorException({
        message:
          error.message || 'Error al solicitar ser amigo de la biblioteca',
        error: error.stack,
      });
    }
  }

  // provicional, no es la task es solo para ver la data del create
  async getAllFriendsLibrary() {
    return this.FriendRepositoy.find({
      relations: ['user'],
    });
  }

  async aproveFriendLibrary(FriendID: number) {
    try {
      const FriendRequest = await this.FriendRepositoy.findOne({
        where: { friendId: FriendID },
        relations: ['user'],
      });
      if (!FriendRequest) {
        throw new NotFoundException('Solicitud no encontrada');
      }
      FriendRequest.status = 'A';
      FriendRequest.user.IsFriend = true;
      await this.FriendRepositoy.save(FriendRequest);
      await this.UserRepository.save(FriendRequest.user);
      return { message: 'La solicitud ha sido aprobada' };
    } catch (error) {
      throw new InternalServerErrorException({
        message: error.message || 'Error al aprobar solicitud de amistad',
        error: error.stack,
      });
    }
  }
}
