import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCollaboratorDTO } from './DTO/create-collaborator-DTO';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Collaborator } from './collaborator.entity';
import { NotesService } from 'src/notes/notes.service';
import { CreateNoteDto } from 'src/notes/dto/create-note.dto';
import { GetAllCollaboratorFilterDTO } from './DTO/get-filter-collaborator-DTO';

@Injectable()
export class CollaboratorService {
    constructor(
        @InjectRepository(Collaborator)
        private collaboratorRepository: Repository<Collaborator>,
        @InjectRepository(User) private UserRepository: Repository<User>,
    
        private noteService: NotesService,
      ) {}
    
      async CreateCollaborator(
        dto: CreateCollaboratorDTO,
        documents: Express.Multer.File[],
      ): Promise<{ message: string }> {
        try {
          const User = await this.UserRepository.findOne({
            where: { cedula: dto.UserCedula },
          });
    
          const documentPaths = documents.map(
            (file) => `/uploads/${file.filename}`,
          );
    
          let newCollaborator: Collaborator;
          if (User) {
            newCollaborator = this.collaboratorRepository.create({
              UserFullName: `${User.name} ${User.lastName}`,
              Entitycollaborator: dto.Entitycollaborator,
              UserCedula: User.cedula,
              UserBirthDate: User.birthDate,
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
            newCollaborator = this.collaboratorRepository.create({
              UserFullName: dto.UserFullName,
              Entitycollaborator: dto.Entitycollaborator,
              UserCedula: dto.UserCedula,
              UserBirthDate: dto.UserBirthDate,
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
            message: `Nueva solicitud de colaborador generada por ${newCollaborator.UserFullName}.`,
            type: 'Solicitud colaborador de la biblioteca',
          };
    
          await this.noteService.createNote(createNoteDto);
          await this.collaboratorRepository.save(newCollaborator);
          return { message: 'Solicitud de colaborador enviada correctamente.' };
        } catch (error) {
          throw new InternalServerErrorException({
            message:
              error.message ||
              'Error al crear la solicitud de colaborador en la biblioteca',
            error: error.stack,
          });
        }
      }
    
      // provicional, no es la task es solo para ver la data del create
      async getAllCollaborator(filterDTO: GetAllCollaboratorFilterDTO) {
        const { SubCategory, PrincipalCategory, DateGenerated, Status, page = 1, limit = 10 } = filterDTO;
    
        const query = this.collaboratorRepository.createQueryBuilder('friend');
    
        if (SubCategory) {
          query.andWhere('friend.SubCategory = :SubCategory', { SubCategory });
        }
    
        if (PrincipalCategory) {
          query.andWhere('friend.PrincipalCategory = :PrincipalCategory', { PrincipalCategory });
        }
    
        if (DateGenerated) {
          query.andWhere('friend.DateGenerated = :DateGenerated', { DateGenerated });
        }
    
        if (Status) {
          query.andWhere('friend.Status = :Status', { Status });
        }
    
        // Aplicar paginación
        query.skip((page - 1) * limit).take(limit);
    
        const [friends, total] = await query.getManyAndCount();
    
        return {
          data: friends,
          total,
          page,
          limit,
        };
        
      }
    
      async aproveCollaborator(CollaboratorId: number): Promise<{ message: string }> {
        try {
          const CollaboratorFounded = await this.collaboratorRepository.findOne({
            where: { CollaboratorId: CollaboratorId },
          });
          if (!CollaboratorFounded) {
            throw new NotFoundException({
              message: 'Solicitud de colaborador no encontrada',
            });
          }
         
          CollaboratorFounded.Status = 'A';
          
          await this.collaboratorRepository.save(CollaboratorFounded);
          return { message: 'Solicitud de colaborador aprobada correctamente' };
        } catch (error) {
          throw new InternalServerErrorException({
            message: error.message || 'Error al aprobar la solicitud de colaborador',
            error: error.stack,
          });
        }
      }
    
    
      async denyCollaborator(CollaboratorId: number): Promise<{ message: string }> {
        try {
          const CollaboratorFounded = await this.collaboratorRepository.findOne({
            where: { CollaboratorId: CollaboratorId },
          });
    
          if (!CollaboratorFounded) {
            throw new NotFoundException({
              message: 'Solicitud de colaborador no encontrada',
            });
          }
          CollaboratorFounded.Status = 'R';
          await this.collaboratorRepository.save(CollaboratorFounded);
          return { message: 'Solicitud de colaborador rechazada correctamente' };
        } catch (error) {
          throw new InternalServerErrorException({
            message: error.message || 'Error al rechazar la solicitud de colaborador',
            error: error.stack,
          });
        }
      }
}
