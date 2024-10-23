import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Donation } from './donation.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { NotesService } from 'src/notes/notes.service';
import { CreateDonationDTO } from './DTO/create-donation-DTO';
import { CreateNoteDto } from 'src/notes/dto/create-note.dto';
import { GetFilterDonationDTO } from './DTO/get-filter-donation-DTO';

@Injectable()
export class DonationService {
    constructor(
        @InjectRepository(Donation)
        private donationRepository: Repository<Donation>,
        @InjectRepository(User) private UserRepository: Repository<User>,
    
        private noteService: NotesService,
      ) {}
    
      async CreateDonation(
        dto: CreateDonationDTO,
        documents: Express.Multer.File[],
      ): Promise<{ message: string }> {
        try {
          const User = await this.UserRepository.findOne({
            where: { cedula: dto.UserCedula },
          });
    
          const documentPaths = documents.map(
            (file) => `/uploads/${file.filename}`,
          );
    
          let newDonation: Donation;
          if (User) {
            newDonation = this.donationRepository.create({
              UserFullName: `${User.name} ${User.lastName}`,
              UserCedula: User.cedula,
              UserBirthDate: User.birthDate,
              UserGender: User.gender,
              UserAddress: User.address,
              UserPhone: User.phoneNumber,
              UserEmail: User.email,
              PrincipalCategory: dto.PrincipalCategory,
              SubCategory: dto.SubCategory,
              DateRecolatedDonation: dto.DateRecolatedDonation,
              ExtraInfo: dto.ExtraInfo,
              Document: documentPaths,
              ResourceCondition: dto.ResourceCondition,
              user: User,
            });
          } else {
            newDonation = this.donationRepository.create({
              UserFullName: dto.UserFullName,
              UserCedula: dto.UserCedula,
              UserBirthDate: dto.UserBirthDate,
              UserGender: dto.UserGender,
              UserAddress: dto.UserAddress,
              UserPhone: dto.UserPhone,
              UserEmail: dto.UserEmail,
              PrincipalCategory: dto.PrincipalCategory,
              SubCategory: dto.SubCategory,
              DateRecolatedDonation: dto.DateRecolatedDonation,
              ExtraInfo: dto.ExtraInfo,
              Document: documentPaths,
              ResourceCondition: dto.ResourceCondition,
            });
          }
    
          const createNoteDto: CreateNoteDto = {
            message: `Nueva solicitud de donacion generada por ${newDonation.UserFullName}.`,
            type: 'Solicitud de donacion',
          };
    
          await this.noteService.createNote(createNoteDto);
          await this.donationRepository.save(newDonation);
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
      async getAllDonation(filterDTO: GetFilterDonationDTO) {
        const { SubCategory, PrincipalCategory, DateRecolatedDonation, Status, page = 1, limit = 10 } = filterDTO;
    
        const query = this.donationRepository.createQueryBuilder('friend');
    
        if (SubCategory) {
          query.andWhere('friend.SubCategory = :SubCategory', { SubCategory });
        }
    
        if (PrincipalCategory) {
          query.andWhere('friend.PrincipalCategory = :PrincipalCategory', { PrincipalCategory });
        }
    
        if (DateRecolatedDonation) {
          query.andWhere('friend.DateRecolatedDonation = :DateRecolatedDonation', { DateRecolatedDonation });
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
    
      async aproveDonation(DonationID: number): Promise<{ message: string }> {
        try {
          const DonationFounded = await this.donationRepository.findOne({
            where: { DonationID: DonationID },
          });
          if (!DonationFounded) {
            throw new NotFoundException({
              message: 'Solicitud de donacion no encontrada',
            });
          }
          if(DonationFounded.Status === 'P'){
            DonationFounded.Status = 'PE'
            await this.donationRepository.save(DonationFounded);
            return { message: 'Solicitud de donacion aprobado para su recoleccion correctamente' };
          }
          if(DonationFounded.Status === 'PE'){
            DonationFounded.Status = 'A'
            await this.donationRepository.save(DonationFounded);
            return { message: 'Solicitud de donacion aprobada correctamente' };
          }
         
        } catch (error) {
          throw new InternalServerErrorException({
            message: error.message || 'Error al aprobar la solicitud de donacion',
            error: error.stack,
          });
        }
      }
    
    
      async denyDonation(DonationID: number): Promise<{ message: string }> {
        try {
          const DonationFounded = await this.donationRepository.findOne({
            where: { DonationID: DonationID },
          });
    
          if (!DonationFounded) {
            throw new NotFoundException({
              message: 'Solicitud de donacion no encontrada',
            });
          }
          DonationFounded.Status = 'R';
          await this.donationRepository.save(DonationFounded);
          return { message: 'Solicitud de donacion rechazada correctamente' };
        } catch (error) {
          throw new InternalServerErrorException({
            message: error.message || 'Error al rechazar la solicitud de donacion',
            error: error.stack,
          });
        }
      }
}
