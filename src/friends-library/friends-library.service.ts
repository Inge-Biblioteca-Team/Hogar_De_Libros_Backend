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
import { NotesService } from 'src/notes/notes.service';
import { CreateNoteDto } from 'src/notes/dto/create-note.dto';

@Injectable()
export class FriendsLibraryService {
  constructor(
    @InjectRepository(FriendsLibrary)
    private FriendRepositoy: Repository<FriendsLibrary>,
    @InjectRepository(User) private UserRepository: Repository<User>,

    private noteService: NotesService,
  ) {}

  async CreateFriend(
    dto: CreateFriendDTO,
    documents: Express.Multer.File[],
  ): Promise<{ message: string }> {
    try {
      const User = await this.UserRepository.findOne({
        where: { cedula: dto.UserCedula },
      });

      const documentPaths = documents.map(
        (file) => `/uploads/${file.filename}`,
      );

      let newFriend: FriendsLibrary;
      if (User) {
        newFriend = this.FriendRepositoy.create({
          UserFullName: `${User.name} ${User.lastName}`,
          UserCedula: User.cedula,
          Disability: dto.Disability,
          UserBirthDate: User.birthDate,
          UserAddress: User.address,
          UserPhone: User.phoneNumber,
          UserEmail: User.email,
          PrincipalCategory: dto.PrincipalCategory,
          SubCategory: dto.SubCategory,
          DateRecolatedDonation: dto.DateRecolatedDonation,
          ExtraInfo: dto.ExtraInfo,
          Document: documentPaths,
          user: User,
        });
      } else {
        newFriend = this.FriendRepositoy.create({
          UserFullName: dto.UserFullName,
          UserCedula: dto.UserCedula,
          Disability: dto.Disability,
          UserBirthDate: dto.UserBirthDate,
          UserAddress: dto.UserAddress,
          UserPhone: dto.UserPhone,
          UserEmail: dto.UserEmail,
          PrincipalCategory: dto.PrincipalCategory,
          SubCategory: dto.SubCategory,
          DateRecolatedDonation: dto.DateRecolatedDonation,
          ExtraInfo: dto.ExtraInfo,
          Document: documentPaths,
        });
      }

      const createNoteDto: CreateNoteDto = {
        message: `Nueva solicitud de actividad de amigo de la biblioteca generada por ${newFriend.UserFullName}.`,
        type: 'Solicitud de amigo de la biblioteca',
      };

      await this.noteService.createNote(createNoteDto);
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

  async aproveFriendLibrary(FriendID: number): Promise<{ message: string }> {
    try {
      const FriendFounded = await this.FriendRepositoy.findOne({
        where: { FriendId: FriendID },
      });
      if (!FriendFounded) {
        throw new NotFoundException({
          message: 'Solicitud de amigo no encontrada',
        });
      }
      FriendFounded.Status = 'A';
      await this.FriendRepositoy.save(FriendFounded);
      return { message: 'Solicitud de amigo aprobada correctamente' };
    } catch (error) {
      throw new InternalServerErrorException({
        message: error.message || 'Error al aprobar la solicitud de amigo',
        error: error.stack,
      });
    }
  }
}
