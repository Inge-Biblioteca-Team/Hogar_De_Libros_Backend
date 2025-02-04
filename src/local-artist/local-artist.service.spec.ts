import { Test, TestingModule } from '@nestjs/testing';
import { LocalArtistService } from './local-artist.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LocalArtist } from './local-artist.entity';
import { NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { CreateLocalArtistDTO } from './DTO/create-local-artist.dto';


const mockArtistRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    andWhere: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
  }),
});

describe('LocalArtistService', () => {
  let service: LocalArtistService;
  let repository: jest.Mocked<Repository<LocalArtist>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalArtistService,
        {
          provide: getRepositoryToken(LocalArtist),
          useValue: mockArtistRepository(),
        },
      ],
    }).compile();

    service = module.get<LocalArtistService>(LocalArtistService);
    repository = module.get(getRepositoryToken(LocalArtist));
  });

  describe('create', () => {
    it('should create and return a new artist', async () => {
      const dto: CreateLocalArtistDTO = {
        Name: 'John Doe',
        ArtisProfession: 'Painter',
        Cover: 'http://example.com/cover.jpg',
        MoreInfo: 'Details',
        FBLink: 'http://facebook.com/johndoe',
        IGLink: 'http://instagram.com/johndoe',
        LILink: 'http://linkedin.com/in/johndoe',
      };
      const newArtist = { ID: 1, ...dto, Actived: true };

      jest.spyOn(repository, 'create').mockReturnValue(newArtist as any);
      jest.spyOn(repository, 'save').mockResolvedValue(newArtist as any);

      const result = await service.create(dto);
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledWith(newArtist);
      expect(result.message).toBe('Artista creado con éxito');
    });

    it('should throw an InternalServerErrorException on error', async () => {
      const dto: CreateLocalArtistDTO = {
        Name: 'John Doe',
        ArtisProfession: 'Painter',
        Cover: 'http://example.com/cover.jpg',
        MoreInfo: 'Details',
        FBLink: 'http://facebook.com/johndoe',
        IGLink: 'http://instagram.com/johndoe',
        LILink: 'http://linkedin.com/in/johndoe',
      };

      jest.spyOn(repository, 'save').mockRejectedValue(new Error('Database error'));

      await expect(service.create(dto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findOne', () => {
    it('should return an artist by ID', async () => {
      const artist = { ID: 1, Name: 'John Doe', ActisProfession: 'Painter', Actived: true };
      jest.spyOn(repository, 'findOne').mockResolvedValue(artist as any);

      const result = await service.findOne(1);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { ID: 1 } });
      expect(result).toEqual(artist);
    });

    it('should throw a NotFoundException if artist is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });
  describe('update', () => {
    it('should update an artist', async () => {
      const artist = {
        ID: 1,
        Name: 'John Doe',
        ArtisProfession: 'Painter',
        Actived: true,
      };

      const updateDto: CreateLocalArtistDTO = {
        Name: 'Jane Doe',
        ArtisProfession: 'Sculptor',
        Cover: 'http://example.com/cover.jpg',
        MoreInfo: 'Updated details',
        FBLink: 'http://facebook.com/janedoe',
        IGLink: 'http://instagram.com/janedoe',
        LILink: 'http://linkedin.com/in/janedoe',
      };

      const updatedArtist = { ...artist, ...updateDto };

      jest.spyOn(service, 'findOne').mockResolvedValue(artist as any);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedArtist as any);

      const result = await service.update(1, updateDto);

      expect(repository.save).toHaveBeenCalledWith(updatedArtist);
      expect(result.message).toBe('Artista actualizado con éxito');
    });

    it('should throw NotFoundException if artist not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.update(1, {} as CreateLocalArtistDTO)).rejects.toThrow('Error al procesar la solicitud');
    });
  });
  describe('DownArtist', () => {
    it('should set Actived to false and return success message', async () => {
      const artist = { ID: 1, Name: 'John Doe', ArtisProfession: 'Painter', Actived: true };
      const updatedArtist = { ...artist, Actived: false };

      jest.spyOn(repository, 'findOne').mockResolvedValue(artist as any);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedArtist as any);

      const result = await service.DownArtist(1);
      expect(repository.save).toHaveBeenCalledWith(updatedArtist);
      expect(result.message).toBe('Artista dado de baja con éxito');
    });

    it('should throw NotFoundException if artist not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.DownArtist(1)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if artist is already inactive', async () => {
      const artist = { ID: 1, Name: 'John Doe', ArtisProfession: 'Painter', Actived: false };
      jest.spyOn(repository, 'findOne').mockResolvedValue(artist as any);

      await expect(service.DownArtist(1)).rejects.toThrow(new BadRequestException({
        message: 'Error al procesar la solicitud',
      }));
    });

    it('should handle unexpected errors gracefully', async () => {
      jest.spyOn(repository, 'findOne').mockRejectedValue(new Error('Unexpected error'));

      await expect(service.DownArtist(1)).rejects.toThrow(InternalServerErrorException);
    });
  });
  });

