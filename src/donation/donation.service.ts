/* eslint-disable prettier/prettier */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Donation } from './donation.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { NotesService } from 'src/notes/notes.service';
import { CreateDonationDTO } from './DTO/create-donation-DTO';
import { CreateNoteDto } from 'src/notes/dto/create-note.dto';
import { GetFilterDonationDTO } from './DTO/get-filter-donation-DTO';
import { DenyDonationRequestDTO } from './DTO/deny-donation-DTO';
import { MailsService } from 'src/mails/mails.service';

@Injectable()
export class DonationService {
  constructor(
    @InjectRepository(Donation)
    private donationRepository: Repository<Donation>,
    @InjectRepository(User) private UserRepository: Repository<User>,
    private mailService: MailsService,
    private noteService: NotesService,
  ) {}

  async CreateDonation(
    dto: CreateDonationDTO,
    documents: Express.Multer.File[],
  ): Promise<{ message: string }> {
    const baseUrl = process.env.BASE_URL;
    try {
      const User = await this.UserRepository.findOne({
        where: { cedula: dto.UserCedula },
      });

      const documentPaths = documents.map(
        (file) => `${baseUrl}/uploads/${file.filename}`,
      );

      let newDonation: Donation;
      if (User) {
        newDonation = this.donationRepository.create({
          UserFullName: `${User.name} ${User.lastName}`,
          UserCedula: User.cedula,
          UserAddress: User.address,
          UserPhone: User.phoneNumber,
          UserEmail: User.email,
          SubCategory: dto.SubCategory,
          DateRecolatedDonation: dto.DateRecolatedDonation,
          ItemDescription: dto.ItemDescription,
          Document: documentPaths,
          ResourceCondition: dto.ResourceCondition,
          user: User,
        });
      } else {
        newDonation = this.donationRepository.create({
          UserFullName: dto.UserFullName,
          UserCedula: dto.UserCedula,
          UserAddress: dto.UserAddress,
          UserPhone: dto.UserPhone,
          UserEmail: dto.UserEmail,
          SubCategory: dto.SubCategory,
          DateRecolatedDonation: dto.DateRecolatedDonation,
          ItemDescription: dto.ItemDescription,
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
    }  catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  // provicional, no es la task es solo para ver la data del create
  async getAllDonation(
    filterDTO: GetFilterDonationDTO,
  ): Promise<{ data: Donation[]; count: number }> {
    const {
      SubCategory,
      PrincipalCategory,
      DateRecolatedDonation,
      Status,
      page = 1,
      limit = 10,
    } = filterDTO;

    const query = this.donationRepository
      .createQueryBuilder('donation')
      .orderBy('donation.DateRecolatedDonation', 'DESC');

    if (SubCategory) {
      query.andWhere('donation.SubCategory = :SubCategory', { SubCategory });
    }

    if (PrincipalCategory) {
      query.andWhere('donation.SubCategory = :PrincipalCategory', {
        PrincipalCategory,
      });
    }

    if (DateRecolatedDonation) {
      query.andWhere(
        'donation.DateRecolatedDonation = :DateRecolatedDonation',
        {
          DateRecolatedDonation,
        },
      );
    }

    if (Status) {
      query.andWhere('donation.Status = :Status', { Status });
    }
    if (!Status) {
      query.andWhere('donation.Status IN (:...statuses)', {
        statuses: ['Aprobado', 'Rechazado', 'Recibido'],
      });
    }

    // Aplicar paginación
    query.skip((page - 1) * limit).take(limit);

    const [donations, count] = await query.getManyAndCount();

    return {
      data: donations,
      count,
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
      DonationFounded.Status = 'Aprobado';
      await this.donationRepository.save(DonationFounded);
      await this.mailService.DonationAprove(DonationID)
      return { message: 'Solicitud de donacion aprobada correctamente' };
    }  catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async denyDonation(
    DonationID: number,
    DTO: DenyDonationRequestDTO,
  ): Promise<{ message: string }> {
    try {
      const DonationFounded = await this.donationRepository.findOne({
        where: { DonationID: DonationID },
      });

      if (!DonationFounded) {
        throw new NotFoundException({
          message: 'Solicitud de donacion no encontrada',
        });
      }
      DonationFounded.Status = 'Rechazado';
      DonationFounded.Reason = DTO.reason;
      await this.donationRepository.save(DonationFounded);
      await this.mailService.DonationRefuse(DonationID)
      return { message: 'Solicitud de donacion rechazada correctamente' };
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async confirmDonation(
    DonationID: number,
    DTO: DenyDonationRequestDTO,
  ): Promise<{ message: string }> {
    try {
      const DonationFounded = await this.donationRepository.findOne({
        where: { DonationID: DonationID },
      });

      if (!DonationFounded) {
        throw new NotFoundException({
          message: 'Solicitud de donacion no encontrada',
        });
      }
      DonationFounded.Status = 'Recibido';
      DonationFounded.Reason = DTO.reason;
      await this.donationRepository.save(DonationFounded);
      return { message: 'Solicitud de donacion rechazada correctamente' };
    }  catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new InternalServerErrorException(errorMessage);
    }
  }
}
