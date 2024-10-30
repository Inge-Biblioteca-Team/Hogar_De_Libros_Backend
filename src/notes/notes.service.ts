/* eslint-disable prettier/prettier */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Note } from './entities/note.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNoteDto } from './dto/create-note.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly notyRepository: Repository<Note>,
  ) {}

  //Pendientes aparecen en las notificaciones sutiles
  async getPendingNotes(): Promise<{ data: Note[]; count: number }> {
    const query = this.notyRepository
      .createQueryBuilder('notes')
      .andWhere('notes.isRead = :isRead', { isRead: 0 })
      .andWhere('notes.trash = :trash', { trash: 0 })
      .orderBy('notes.date', 'ASC');

    const [data, count] = await query.getManyAndCount();

    return { data, count };
  }

  //Todas pero paginadas y por filtros, Leidos y no leidos, mas rango de fechas
  async getReadNotes(): Promise<{ data: Note[]; count: number }> {
    const query = this.notyRepository
      .createQueryBuilder('notes')
      .andWhere('notes.isRead = :isRead', { isRead: 1 })
      .andWhere('notes.trash = :trash', { trash: 0 })
      .orderBy('notes.date', 'ASC');

    const [data, count] = await query.getManyAndCount();

    return { data, count };
  }

  //La papelera
  async getTrashdNotes(): Promise<{ data: Note[]; count: number }> {
    const query = this.notyRepository
      .createQueryBuilder('notes')
      .andWhere('notes.isRead = :isRead', { isRead: 1 })
      .andWhere('notes.trash = :trash', { trash: 1 })
      .orderBy('notes.date', 'ASC');

    const [data, count] = await query.getManyAndCount();

    return { data, count };
  }

  //Cuando se abra se marca y deja de ser parte de las no leidas
  async markAsRead(notificationId: number): Promise<{ message: string }> {
    try {
      await this.notyRepository
        .createQueryBuilder()
        .update('notes')
        .set({ isRead: true })
        .where('id_Note = :id_Note', { id_Note: notificationId })
        .execute();
      return { message: 'Exito' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al mover la notificación a la papelera',
      );
    }
  }

  
  async moveMultipleToRead(
    notificationIds: number[],
  ): Promise<{ message: string }> {
    try {
      await this.notyRepository
        .createQueryBuilder()
        .update('notes')
        .set({ isRead: true })
        .whereInIds(notificationIds)
        .execute();
      return { message: 'Exito' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al mover las notificaciones a la papelera',
      );
    }
  }

  //Para mover a papelera y establecer un dia de borrado para luego un job si supera los 30 se borra total
  async moveToTras(notificationId: number): Promise<{ message: string }> {
    const currentDate = new Date().toISOString().split('T')[0];
    try {
      await this.notyRepository
        .createQueryBuilder()
        .update('notes')
        .set({ trash: true, deletedAt: currentDate })
        .where('id_Note = :id', { id: notificationId })
        .execute();
      return { message: 'Exito' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al mover la notificación a la papelera',
      );
    }
  }

  async moveMultipleToTrash(
    notificationIds: number[],
  ): Promise<{ message: string }> {
    const currentDate = new Date().toISOString().split('T')[0];
    try {
      await this.notyRepository
        .createQueryBuilder()
        .update('notes')
        .set({ trash: true, deletedAt: currentDate })
        .whereInIds(notificationIds)
        .execute();
      return { message: 'Exito' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al mover las notificaciones a la papelera',
      );
    }
  }
  //Recuperar de la papelera
  async recoverFromTras(notificationId: number): Promise<{ message: string }> {
    try {
      await this.notyRepository
        .createQueryBuilder()
        .update('notes')
        .set({ trash: false, deletedAt: null })
        .where('id_Note = :id', { id: notificationId })
        .execute();
        return { message: 'Exito' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al mover la notificación a la papelera',
      );
    }
  }

  async recoveryMultiplefromTrash(
    notificationIds: number[],
  ): Promise<{ message: string }> {
    try {
      await this.notyRepository
        .createQueryBuilder()
        .update('notes')
        .set({ trash: false, deletedAt: null })
        .whereInIds(notificationIds)
        .execute();
        return { message: 'Exito' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al mover las notificaciones a la papelera',
      );
    }
  }

  //Borrados individual y nulo
  async deleteFromTrash(notificationId: number): Promise<{message:string}> {
    try {
      const result = await this.notyRepository
        .createQueryBuilder()
        .delete()
        .from('notes')
        .where('id_Note = :id', { id: notificationId })
        .andWhere('trash = :trash', { trash: 1 })
        .execute();

      if (result.affected === 0) {
        throw new NotFoundException(
          'La notificación no está en la papelera o no existe',
        );
      }
      return { message: 'Exito' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al eliminar la notificación de la papelera',
      );
    }
  }

  async deleteMultipleFromTrash(notificationIds: number[]): Promise<{message:string}> {
    try {
      const result = await this.notyRepository
        .createQueryBuilder()
        .delete()
        .from('notes')
        .whereInIds(notificationIds)
        .andWhere('trash = :trash', { trash: 1 })
        .execute();

      if (result.affected === 0) {
        throw new NotFoundException(
          'No se encontraron notificaciones en la papelera para eliminar',
        );
      }
      return { message: 'Exito' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al eliminar las notificaciones de la papelera',
      );
    }
  }

  //Este es el servicio del job va a eliminar los que superen los 30 dias de eliminados cada que se ejecute
  async deleteExpiredNotifications(): Promise<void> {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() - 30);

    try {
      await this.notyRepository
        .createQueryBuilder()
        .delete()
        .from('notes')
        .where('trash = :trash', { trash: 1 })
        .andWhere('deletedAt <= :expirationDate', { expirationDate })
        .execute();
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al eliminar notificaciones expiradas de la papelera',
      );
    }
  }

  //Crear Notificacion
  async createNote(createNoteDto: CreateNoteDto): Promise<{ message: string }> {
    const newNote = this.notyRepository.create(createNoteDto);
    await this.notyRepository.save(newNote);
    return { message: 'Exito' };
  }
}
