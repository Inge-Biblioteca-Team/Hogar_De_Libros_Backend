/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
// PROMISE MESSAGE
  async create(
    createLocalArtistDto: CreateLocalArtistDTO,
  ): Promise<LocalArtist> {
    const newArtist = this.localArtistRepository.create(createLocalArtistDto);
    return this.localArtistRepository.save(newArtist);
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

    if (Actived !== undefined) {
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

  // PROMISE MESSAGE
  async update(
    id: number,
    updateLocalArtistDto: CreateLocalArtistDTO,
  ): Promise<LocalArtist> {
    const artist = await this.findOne(id);  
    Object.assign(artist, updateLocalArtistDto);  
    return this.localArtistRepository.save(artist); 
  }
  // PROMISE MESSAGE
  async DownArtist(ArtistID: number): Promise<LocalArtist> {
    const Artist = await this.localArtistRepository.findOne({
      where: { ID: ArtistID },
    });
    if (!Artist) {
      throw new NotFoundException('No existe el artista');
    }
    if (!Artist.Actived) {
      throw new BadRequestException('El artista ya está inactivo');
    }
    Artist.Actived = false;
    return this.localArtistRepository.save(Artist);
  }
}
