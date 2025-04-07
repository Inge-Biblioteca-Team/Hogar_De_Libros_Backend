/* eslint-disable prettier/prettier */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoomReservationDto } from './dto/create-room-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomReservation } from './entities/room-reservation.entity';
import { Not, Repository } from 'typeorm';
import { ReservationDTO } from './dto/GetReservationsDTO';
import { FilterGetDTO } from './dto/FilterGetDTO';
import { Queque } from './dto/ReservationsQueque';
import { UpdateRoomReservationDto } from './dto/update-room-reservation.dto';
import { UserReservationDTO } from './dto/UserReservations';
import { NotesService } from 'src/notes/notes.service';
import { CreateNoteDto } from 'src/notes/dto/create-note.dto';

@Injectable()
export class RoomReservationService {
  constructor(
    @InjectRepository(RoomReservation)
    private readonly reservationRepository: Repository<RoomReservation>,

    private noteService: NotesService,
  ) {}

  async getAllReservations(
    Search: FilterGetDTO,
  ): Promise<{ data: ReservationDTO[]; count: number }> {
    const {
      page = 1,
      limit = 5,
      reserveStatus,
      date,
      roomId,
      userCedula,
    } = Search;
    const query = this.reservationRepository
      .createQueryBuilder('room_reservations')
      .leftJoinAndSelect('room_reservations.user', 'user')
      .leftJoinAndSelect('room_reservations.rooms', 'rooms')
      .leftJoinAndSelect('room_reservations.events', 'events')
      .leftJoinAndSelect('room_reservations.course', 'course')
      .orderBy('room_reservations.date', 'ASC');

    if (reserveStatus) {
      query.andWhere('room_reservations.reserveStatus = :status', {
        status: reserveStatus,
      });
    }
    if (reserveStatus == 'Finalizado') {
      query.orderBy('room_reservations.date', 'DESC');
    }
    if (roomId) {
      query.andWhere('room_reservations.roomId = :roomId', {
        roomId: roomId,
      });
    }
    if (date) {
      query.andWhere('room_reservations.date = :date', {
        date: date,
      });
    }

    if (userCedula) {
      query.andWhere('room_reservations.userCedula = :userCedula', {
        userCedula: userCedula,
      });
    }

    query.skip((page - 1) * limit).take(limit);

    const [data, count] = await query.getManyAndCount();

    const result = data.map((reserve) => {
      return {
        rommReservationId: reserve.rommReservationId,
        name: reserve.name,
        reservationDate: reserve.reservationDate,
        date: reserve.date,
        selectedHours: reserve.selectedHours,
        observations: reserve.observations,
        personNumber: reserve.personNumber,
        reason: reserve.reason,
        finishObservation: reserve.finishObservation,
        reserveStatus: reserve.reserveStatus,
        EventName: reserve.events?.Title || '',
        CourseName: reserve.course?.courseName || '',
        UserName: reserve.user?.name || '',
        UserLastName: reserve.user?.lastName || '',
        UserCedula: reserve.user?.cedula || '',
        UserEmail: reserve.user?.email || '',
        UserPhone: reserve.user?.phoneNumber || '',
        room: reserve.rooms?.roomNumber || 0,
        roomName: reserve.rooms?.name || '',
      } as ReservationDTO;
    });
    return { data: result, count };
  }

  async getActiveResertavions(Search: FilterGetDTO): Promise<Queque[]> {
    const { date } = Search;
    const query = this.reservationRepository
      .createQueryBuilder('room_reservations')
      .leftJoinAndSelect('room_reservations.rooms', 'rooms')
      .andWhere('room_reservations.reserveStatus <> :status', {
        status: 'Finalizado',
      });

    if (date) {
      query.andWhere('room_reservations.date = :date', {
        date: date,
      });
    }

    const data = await query.getMany();
    const result = data.map((reserve) => {
      return {
        rommReservationId: reserve.rommReservationId,
        selectedHours: reserve.selectedHours,
        reason: reserve.reason,
        roomNumber: reserve.rooms.roomNumber,
      } as Queque;
    });

    return result;
  }

  async NewReservation(
    newReservation: CreateRoomReservationDto,
  ): Promise<{ message: string }> {
    try {
      let eventID: number;
      let courseID: number;

      if (newReservation.EventId == 0) {
        eventID = null;
      } else {
        eventID = newReservation.EventId;
      }
      if (newReservation.courseId == 0) {
        courseID = null;
      } else {
        courseID = newReservation.courseId;
      }

      if (!newReservation.reservationDate) {
        newReservation.reservationDate = new Date();
      }
      const reservation = this.reservationRepository.create({
        ...newReservation,
        user: { cedula: newReservation.userCedula },
        events: { EventId: eventID },
        course: { courseId: courseID },
        rooms: { roomId: newReservation.roomId },
      });

      const createNoteDto: CreateNoteDto = {
        message: `Nueva solicitud de sala, para el dia ${newReservation.date} ha sido solicitada por el usuario ${newReservation.name}.`,
        type: 'Solicitud de Sala',
      };
      await this.noteService.createNote(createNoteDto);

      await this.reservationRepository.save(reservation);
      return {
        message: 'La solicitud se genero correctamente',
      };
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async finalizeReservation(
    id: number,
    objetive: UpdateRoomReservationDto,
  ): Promise<{ message: string }> {
    try {
      const reservation = await this.reservationRepository.findOne({
        where: { rommReservationId: id },
      });

      if (!reservation) {
        throw new NotFoundException({
          message: 'No se encontró la reservacion.',
        });
      }
      reservation.reserveStatus = 'Finalizado';

      reservation.finishObservation = objetive.finishObservation;

      await this.reservationRepository.save(reservation);
      return {
        message: 'La solicitud se genero correctamente',
      };
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async refuseReservation(id: number): Promise<{ message: string }> {
    try {
      const reservation = await this.reservationRepository.findOne({
        where: { rommReservationId: id },
      });

      if (!reservation) {
        throw new NotFoundException({
          message: 'No se encontró la reservacion.',
        });
      }
      reservation.reserveStatus = 'Finalizado';

      reservation.finishObservation = 'Rechazado por el administrador';

      await this.reservationRepository.save(reservation);
      return {
        message: 'La solicitud se genero correctamente',
      };
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async cencelReservation(id: number): Promise<{ message: string }> {
    try {
      const reservation = await this.reservationRepository.findOne({
        where: { rommReservationId: id },
      });

      if (!reservation) {
        throw new NotFoundException({
          message: 'No se encontró la reservacion.',
        });
      }
      reservation.reserveStatus = 'Finalizado';

      reservation.finishObservation = 'Cancelado por el usuario';

      await this.reservationRepository.save(reservation);
      return {
        message: 'La solicitud se genero correctamente',
      };
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async aprovReservation(id: number): Promise<{ message: string }> {
    try {
      const reservation = await this.reservationRepository.findOne({
        where: { rommReservationId: id },
      });

      if (!reservation) {
        throw new NotFoundException({
          message: `No se encontro la reservacion`,
        });
      }
      reservation.reserveStatus = 'Aprobado';

      await this.reservationRepository.save(reservation);
      return {
        message: 'La solicitud se genero correctamente',
      };
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async countReservationsByCedula(
    userCedula: string,
  ): Promise<{ count: number }> {
    const count = await this.reservationRepository.count({
      where: {
        user: { cedula: userCedula },
        reserveStatus: Not("Finalizado")
      },
    });

    return { count };
  }

  async getAllUserReservations(
    Search: FilterGetDTO,
  ): Promise<{ data: UserReservationDTO[]; count: number }> {
    const { userCedula } = Search;
    const query = this.reservationRepository
      .createQueryBuilder('room_reservations')
      .leftJoinAndSelect('room_reservations.user', 'user')
      .leftJoinAndSelect('room_reservations.rooms', 'rooms')
      .leftJoinAndSelect('room_reservations.events', 'events')
      .leftJoinAndSelect('room_reservations.course', 'course')
      .andWhere('room_reservations.reserveStatus <> :status', {
        status: 'Finalizado',
      })
      .orderBy('room_reservations.date', 'ASC');

    if (userCedula) {
      query.andWhere('room_reservations.userCedula = :userCedula', {
        userCedula: userCedula,
      });
    }

    const [data, count] = await query.getManyAndCount();

    const result = data.map((reserve) => {
      return {
        rommReservationId: reserve.rommReservationId,
        name: reserve.name,
        date: reserve.date,
        selectedHours: reserve.selectedHours,
        observations: reserve.observations,
        personNumber: reserve.personNumber,
        reason: reserve.reason,
        reserveStatus: reserve.reserveStatus,
        room: reserve.rooms?.roomNumber || 0,
        roomName: reserve.rooms?.name || '',
        images: reserve.rooms.image,
      } as UserReservationDTO;
    });
    return { data: result, count };
  }
}
