/* eslint-disable prettier/prettier */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCollaboratorDTO } from './DTO/create-collaborator-DTO';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Collaborator } from './collaborator.entity';
import { NotesService } from 'src/notes/notes.service';
import { CreateNoteDto } from 'src/notes/dto/create-note.dto';
import { GetAllCollaboratorFilterDTO } from './DTO/get-filter-collaborator-DTO';
import { DenyCollaboratorRequestDTO } from './DTO/deny-collaborator-DTO';
import { MailsService } from 'src/mails/mails.service';

@Injectable()
export class CollaboratorService {
  constructor(
    @InjectRepository(Collaborator)
    private collaboratorRepository: Repository<Collaborator>,
    @InjectRepository(User) private UserRepository: Repository<User>,
    private noteService: NotesService,
    private mailService: MailsService
  ) {}

  async CreateCollaborator(
    dto: CreateCollaboratorDTO,
    documents: Express.Multer.File[],
  ): Promise<{ message: string }> {
    const baseUrl = process.env.BASE_URL;
    try {
      const User = await this.UserRepository.findOne({
        where: { cedula: dto.UserCedula },
      });
      /// cambiar a variable de entorno el documente path base url
      const documentPaths = documents.map(
        (file) => `${baseUrl}/uploads/${file.filename}`,
      );

      let newCollaborator: Collaborator;
      if (User) {
        newCollaborator = this.collaboratorRepository.create({
          UserFullName: `${User.name} ${User.lastName}`,
          Entitycollaborator: dto.Entitycollaborator,
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
          activityDate: dto.activityDate,
          Description: dto.Description,
          user: User,
        });
      } else {
        newCollaborator = this.collaboratorRepository.create({
          UserFullName: dto.UserFullName,
          Entitycollaborator: dto.Entitycollaborator,
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
          Description: dto.Description,
          activityDate: dto.activityDate,
          Document: documentPaths,
        });
      }

      const createNoteDto: CreateNoteDto = {
        message: `Nueva solicitud de colaborador generada por ${newCollaborator.UserFullName}.`,
        type: 'Solicitud colaborador de la biblioteca',
      };

      await this.noteService.createNote(createNoteDto);
      await this.collaboratorRepository.save(newCollaborator);
      return { message: 'Solicitud de colaborador enviada correctamente.' };
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async getAllCollaborator(
    filterDTO: GetAllCollaboratorFilterDTO,
  ): Promise<{ data: Collaborator[]; count: number }> {
    const {
      SubCategory,
      PrincipalCategory,
      DateGenerated,
      Status,
      page = 1,
      limit = 5,
    } = filterDTO;

    const skip = (page - 1) * limit;

    const query = this.collaboratorRepository
      .createQueryBuilder('collaborator')
      .orderBy('collaborator.activityDate', 'DESC');

    if (SubCategory) {
      query.andWhere('collaborator.SubCategory = :SubCategory', {
        SubCategory,
      });
    }

    if (PrincipalCategory) {
      query.andWhere('collaborator.PrincipalCategory = :PrincipalCategory', {
        PrincipalCategory,
      });
    }

    if (DateGenerated) {
      query.andWhere('collaborator.activityDate = :DateGenerated', {
        DateGenerated,
      });
    }

    if (Status) {
      query.andWhere('collaborator.Status = :Status', { Status });
    }
    if (!Status) {
      query.andWhere('collaborator.Status IN (:...statuses)', {
        statuses: ['Aprobado', 'Rechazado', 'Cancelado'],
      });
    }

    const [data, count] = await query.skip(skip).take(limit).getManyAndCount();

    return { data, count };
  }

  async aproveCollaborator(
    CollaboratorId: number,
  ): Promise<{ message: string }> {
    try {
      const CollaboratorFounded = await this.collaboratorRepository.findOne({
        where: { CollaboratorId: CollaboratorId },
      });
      if (!CollaboratorFounded) {
        throw new NotFoundException({
          message: 'Solicitud de colaborador no encontrada',
        });
      }

      CollaboratorFounded.Status = 'Aprobado';

      await this.collaboratorRepository.save(CollaboratorFounded);
      await this.mailService.colabAprove(CollaboratorId)
      return { message: 'Solicitud de colaborador aprobada correctamente' };
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async denyCollaborator(
    CollaboratorId: number,
    dto: DenyCollaboratorRequestDTO,
  ): Promise<{ message: string }> {
  
    try {
      const CollaboratorFounded = await this.collaboratorRepository.findOne({
        where: { CollaboratorId: CollaboratorId },
      });
      if (!CollaboratorFounded) {
        throw new NotFoundException({
          message: 'Solicitud de colaborador no encontrada',
        });
      }
      CollaboratorFounded.Status = 'Rechazado';

      CollaboratorFounded.Reason = dto.reason;

      await this.collaboratorRepository.save(CollaboratorFounded);
      await this.mailService.colabRefuse(CollaboratorId)
      return { message: 'Solicitud de colaborador rechazada correctamente' };
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async CancelCollaborator(
    CollaboratorId: number,
    dto: DenyCollaboratorRequestDTO,
  ): Promise<{ message: string }> {
 
    try {
      const CollaboratorFounded = await this.collaboratorRepository.findOne({
        where: { CollaboratorId: CollaboratorId },
      });
      if (!CollaboratorFounded) {
        throw new NotFoundException({
          message: 'Solicitud de colaborador no encontrada',
        });
      }
      CollaboratorFounded.Status = 'Cancelado';

      CollaboratorFounded.Reason = dto.reason;

      await this.collaboratorRepository.save(CollaboratorFounded);
      await this.mailService.colabCancel(CollaboratorId)
      return { message: 'Solicitud de colaborador cancelada correctamente' };
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new InternalServerErrorException(errorMessage);
    }
  }
}
