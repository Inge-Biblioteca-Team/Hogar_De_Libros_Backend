/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginatedQueryDTO } from './DTO/Paginated-Query';
import { LocalArtist } from './local-artist.entity';
import { CreateLocalArtistDTO } from './DTO/create-local-artist.dto';
@Injectable()
export class LocalArtistService {
  constructor(
    @InjectRepository(LocalArtist)
    private localArtistRepository: Repository<LocalArtist>,
  ) {}

  async create(
    createLocalArtistDto: CreateLocalArtistDTO,
  ): Promise<{ message: string }> {
    const baseUrl = process.env.BASE_URL;
    try {
      if (!createLocalArtistDto.Cover) {
        createLocalArtistDto.Cover = `${baseUrl}/assets/Artistas/${createLocalArtistDto.ArtisProfession}.jpg`;
      }

      const newArtist = this.localArtistRepository.create(createLocalArtistDto);
      await this.localArtistRepository.save(newArtist);
      return { message: 'Artista creado con éxito' };
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async findAll(
    PaginationFilterDto: PaginatedQueryDTO,
  ): Promise<{ data: LocalArtist[]; count: number }> {
    const {
      page = 1,
      limit = 10,
      Name,
      ArtisProfession,
      Actived,
    } = PaginationFilterDto;

    const queryBuilder =
      this.localArtistRepository.createQueryBuilder('artist');

    if (Name) {
      queryBuilder.andWhere('artist.Name LIKE :Name', { Name: `%${Name}%` });
    }

    if (ArtisProfession) {
      queryBuilder.andWhere('artist.ArtisProfession LIKE :ArtisProfession', {
        ArtisProfession: `%${ArtisProfession}%`,
      });
    }

    if (Actived) {
      queryBuilder.andWhere('artist.Actived = :Actived', { Actived });
    }

    queryBuilder.skip((page - 1) * limit).take(limit);

    const [data, count] = await queryBuilder.getManyAndCount();

    return { data, count };
  }

  async findOne(id: number): Promise<LocalArtist> {
    const artist = await this.localArtistRepository.findOne({
      where: { ID: id },
    });
    if (!artist) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    return artist;
  }

  async update(
    id: number,
    updateLocalArtistDto: CreateLocalArtistDTO,
  ): Promise<{ message: string }> {
    try {
      const artist = await this.findOne(id);
      Object.assign(artist, updateLocalArtistDto);
      await this.localArtistRepository.save(artist);
      return { message: 'Artista actualizado con éxito' };
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async DownArtist(ArtistID: number): Promise<{ message: string }> {
    try {
      const Artist = await this.localArtistRepository.findOne({
        where: { ID: ArtistID },
      });
      if (!Artist) {
        throw new NotFoundException({
          message: 'No existe el artista',
        });
      }
      if (!Artist.Actived) {
        throw new BadRequestException({
          message: 'El artista ya se encuentra de baja',
        });
      }
      Artist.Actived = false;
      await this.localArtistRepository.save(Artist);
      return { message: 'Artista dado de baja con éxito' };
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new InternalServerErrorException(errorMessage);
    }
  }


  async UpArtist(ArtistID: number): Promise<{ message: string }> {
    try {
      const Artist = await this.localArtistRepository.findOne({
        where: { ID: ArtistID },
      });
      if (!Artist) {
        throw new NotFoundException({
          message: 'No existe el artista',
        });
      }
      if (Artist.Actived) {
        throw new BadRequestException({
          message: 'El artista ya se encuentra activo',
        });
      }
      Artist.Actived = true;
      await this.localArtistRepository.save(Artist);
      return { message: 'Artista habilitado con éxito' };
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new InternalServerErrorException(errorMessage);
    }
  }
  
}
