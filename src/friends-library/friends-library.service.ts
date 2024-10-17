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
    documents: Express.Multer.File[],
    images: Express.Multer.File[],
  ): Promise<{ message: string }> {
    try {
      let user = await this.UserRepository.findOne({
        where: { cedula: dto.UserCedula },
      });

      if (!user) {
        user = null;
      }

      const newFriend = this.FriendRepositoy.create({
        user,
        UserCedula: dto.UserCedula,
        UserName: dto.UserName,
        UserLastName: dto.UserLastName,
        UserGender: dto.UserGender,
        UserAge: dto.UserAge,
        UserAddress: dto.UserAddress,
        UserPhone: dto.UserPhone,
        UserEmail: dto.UserEmail,
        PrincipalCategory: dto.PrincipalCategory,
        SubCategory: dto.SubCategory,
        DateRecolatedDonation: dto.DateRecolatedDonation,
      });

      if (documents && documents.length > 0) {
        newFriend.Document = documents.map((file) => file.filename);
      }

      if (images && images.length > 0) {
        newFriend.Image = images.map((file) => file.filename);
      }

      await this.FriendRepositoy.save(newFriend);

      return { message: 'Solicitud de amigo enviada correctamente.' };
    } catch (error) {
      throw new InternalServerErrorException({
        message:
          error.message ||
          'Error al crear la solicitud de amigo en la biblioteca',
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
        where: { FriendId: FriendID },
        relations: ['user'],
      });

      if (!FriendRequest) {
        throw new NotFoundException('Solicitud no encontrada');
      }

      FriendRequest.Status = 'A';

      if (FriendRequest.user) {
        FriendRequest.user.IsFriend = true;
        await this.UserRepository.save(FriendRequest.user);
      }

      await this.FriendRepositoy.save(FriendRequest);

      return { message: 'La solicitud ha sido aprobada' };
    } catch (error) {
      throw new InternalServerErrorException({
        message: error.message || 'Error al aprobar la solicitud de amistad',
        error: error.stack,
      });
    }
  }
}
