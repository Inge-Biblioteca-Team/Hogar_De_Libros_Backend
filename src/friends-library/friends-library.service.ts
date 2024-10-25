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
import { CreateFriendDTO } from './DTO/create-friend-library-DTO';
import { NotesService } from 'src/notes/notes.service';
import { CreateNoteDto } from 'src/notes/dto/create-note.dto';
import { GetAllFriendsFilterDTO } from './DTO/get-filter-friendLibrary.Dto';
import { DenyFriendRequestDTO } from './DTO/deny-friend-library.Dto';
import { UpdateFriendDTO } from './DTO/update-friend-library-DTO';

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
          UserBirthDate: User.birthDate,
          UserGender: User.gender,
          UserAddress: User.address,
          UserPhone: User.phoneNumber,
          UserEmail: User.email,
          PrincipalCategory: dto.PrincipalCategory,
          SubCategory: dto.SubCategory,
          Experience: dto.Experience,
          ExtraInfo: dto.ExtraInfo,
          Document: documentPaths,
          user: User,
        });
      } else {
        newFriend = this.FriendRepositoy.create({
          UserFullName: dto.UserFullName,
          UserCedula: dto.UserCedula,
          UserBirthDate: dto.UserBirthDate,
          UserGender: dto.UserGender,
          UserAddress: dto.UserAddress,
          UserPhone: dto.UserPhone,
          UserEmail: dto.UserEmail,
          PrincipalCategory: dto.PrincipalCategory,
          SubCategory: dto.SubCategory,
          Experience: dto.Experience,
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

  async getAllFriends(
    filterDTO: GetAllFriendsFilterDTO,
  ): Promise<{ data: FriendsLibrary[]; count: number }> {
    const {
      SubCategory,
      PrincipalCategory,
      DateGenerated,
      Status,
      page = 1,
      limit = 10,
      Exp,
    } = filterDTO;

    const query = this.FriendRepositoy.createQueryBuilder('friend').orderBy(
      'friend. DateGenerated',
      'ASC',
    );

    if (SubCategory) {
      query.andWhere('friend.SubCategory = :SubCategory', { SubCategory });
    }

    if (PrincipalCategory) {
      query.andWhere('friend.PrincipalCategory = :PrincipalCategory', {
        PrincipalCategory,
      });
    }

    if (DateGenerated) {
      query.andWhere('friend.DateGenerated = :DateGenerated', {
        DateGenerated,
      });
    }

    if (Status) {
      query.andWhere('friend.Status = :Status', { Status });
    }
    if (!Status) {
      query.andWhere('friend.Status IN (:...statuses)', {
        statuses: ['Aprobado', 'Rechazado', 'Baja'],
      });
    }
    if (Exp) {
      query.andWhere('friend.Experience Like :Exp', { Exp: `%${Exp}%` });
    }

    query.skip((page - 1) * limit).take(limit);

    const [friends, count] = await query.getManyAndCount();

    return {
      data: friends,
      count,
    };
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

      FriendFounded.Status = 'Aprobado';

      await this.FriendRepositoy.save(FriendFounded);
      return { message: 'Solicitud de amigo aprobada correctamente' };
    } catch (error) {
      throw new InternalServerErrorException({
        message: error.message || 'Error al aprobar la solicitud de amigo',
        error: error.stack,
      });
    }
  }

  async denyFriendLibrary(
    FriendID: number,
    dto: DenyFriendRequestDTO,
  ): Promise<{ message: string }> {
    try {
      const FriendFounded = await this.FriendRepositoy.findOne({
        where: { FriendId: FriendID },
      });

      if (!FriendFounded) {
        throw new NotFoundException({
          message: 'Solicitud de amigo no encontrada',
        });
      }
      FriendFounded.Status = 'Rechazado';
      FriendFounded.Reason = dto.reason;

      console.log(FriendFounded);
      await this.FriendRepositoy.save(FriendFounded);

      return { message: 'Solicitud de amigo rechazada correctamente' };
    } catch (error) {
      throw new InternalServerErrorException({
        message: error.message || 'Error al rechazar la solicitud de amigo',
        error: error.stack,
      });
    }
  }
  async downFriendLibrary(
    FriendID: number,
    dto: DenyFriendRequestDTO,
  ): Promise<{ message: string }> {
    try {
      const FriendFounded = await this.FriendRepositoy.findOne({
        where: { FriendId: FriendID },
      });

      if (!FriendFounded) {
        throw new NotFoundException({
          message: 'Solicitud de amigo no encontrada',
        });
      }
      FriendFounded.Status = 'Baja';
      FriendFounded.Reason = dto.reason;

      await this.FriendRepositoy.save(FriendFounded);

      return { message: 'Amigo dado de baja correctamente' };
    } catch (error) {
      throw new InternalServerErrorException({
        message: error.message || 'Error al dar de baja',
        error: error.stack,
      });
    }
  }
  async editFriendLibrary(
    FriendID: number,
    dto: UpdateFriendDTO,
  ): Promise<{ message: string }> {
    try {
      const FriendFounded = await this.FriendRepositoy.findOne({
        where: { FriendId: FriendID },
      });

      if (!FriendFounded) {
        throw new NotFoundException({
          message: 'Solicitud de amigo no encontrada',
        });
      }

      Object.assign(FriendFounded, dto);
      
      await this.FriendRepositoy.save(FriendFounded);

      return { message: 'Amigo dado de baja correctamente' };
    } catch (error) {
      throw new InternalServerErrorException({
        message: error.message || 'Error al dar de baja',
        error: error.stack,
      });
    }
  }
}
