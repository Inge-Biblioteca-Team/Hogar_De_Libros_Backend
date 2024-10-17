/* eslint-disable prettier/prettier */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Advice } from './entities/advice.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAdviceDto } from './dto/create-advice.dto';
import { UpdateAdviceDto } from './dto/update-advice.dto';
import { Paginacion_AdviceDTO } from './dto/Paginacion-Advice.dto';

@Injectable()
export class AdvicesService {
  constructor(
    @InjectRepository(Advice)
    private adviceRepository: Repository<Advice>,
  ) {}

  async createNewAdvice(Dto: CreateAdviceDto): Promise<{ message: string }> {
    try {
      const Advice = this.adviceRepository.create(Dto);
      await this.adviceRepository.save(Advice);
      return {
        message: 'El aviso se genero correctamente',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Error al procesar la solicitud',
      );
    }
  }

  async editAdvice(
    Dto: UpdateAdviceDto,
    id: number,
  ): Promise<{ message: string }> {
    try {
      const advice = await this.adviceRepository.findOne({
        where: { id_Advice: id },
      });
      if (!advice) {
        throw new NotFoundException('Aviso no encontrado');
      }
      Object.assign(advice, Dto);
      await this.adviceRepository.save(advice);

      return {
        message: 'El aviso se modifico correctamente',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Error al procesar la solicitud',
      );
    }
  }

  async deleteAdvice(id: number): Promise<{ message: string }> {
    try {
      const advice = await this.adviceRepository.findOne({
        where: { id_Advice: id },
      });
      if (!advice) {
        throw new NotFoundException('Aviso no encontrado');
      }

      await this.adviceRepository.remove(advice);

      return {
        message: 'El aviso se elimino correctamente',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Error al procesar la solicitud',
      );
    }
  }

  async getAdvice(
    params: Paginacion_AdviceDTO,
  ): Promise<{ data: Advice[]; count: number }> {
    try {
      const { page = 1, limit = 5, reason, category, date } = params;
      const skip = (page - 1) * limit;
      const queryBuilder = this.adviceRepository
        .createQueryBuilder('advice')
        .orderBy('advice.date', 'DESC');
      if (reason) {
        queryBuilder.andWhere('advice.reason LIKE :reason', {
          reason: `%${reason}%`,
        });
      }

      if (category) {
        queryBuilder.andWhere('advice.category = :category', { category });
      }

      if (date) {
        queryBuilder.andWhere('advice.date = :date', { date });
      }

      const [data, count] = await queryBuilder
        .skip(skip)
        .take(limit)
        .getManyAndCount();

      return { data, count };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Error al procesar la solicitud',
      );
    }
  }

  async updateExpiredAdvice() {
    const currentDate = new Date();
    await this.adviceRepository
      .createQueryBuilder()
      .update(Advice)
      .set({ status: false })
      .where('date < :currentDate', { currentDate })
      .execute();
  }

  async deleteExpiredAdvice() {
    await this.adviceRepository
      .createQueryBuilder()
      .delete()
      .from(Advice)
      .where('status = :status', { status: false })
      .execute();
  }
}
