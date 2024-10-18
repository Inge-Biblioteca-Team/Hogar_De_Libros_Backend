
import { Test, TestingModule } from '@nestjs/testing';
import { LocalArtistService } from './local-artist.service';
import { LocalArtist } from './local-artist.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
;
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateLocalArtistDTO } from './DTO/create-local-artist.dto';
import { PaginatedQueryDTO } from './DTO/Paginated-Query';

describe('LocalArtistService', () => {
  let service: LocalArtistService;
  let repository: Repository<LocalArtist>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalArtistService,
        {
          provide: getRepositoryToken(LocalArtist),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<LocalArtistService>(LocalArtistService);
    repository = module.get<Repository<LocalArtist>>(getRepositoryToken(LocalArtist));
  });

  describe('create', () => {
    it('should create and return a new artist', async () => {
      const dto: CreateLocalArtistDTO = {
        Name: 'John Doe',
        ArtisProfession: 'Painter',
        Cover: 'http://example.com/cover.jpg',
        MoreInfo: 'Some mentions and details',
        FBLink: 'http://facebook.com/johndoe',
        IGLink: 'http://instagram.com/johndoe',
        LILink: 'http://linkedin.com/in/johndoe',
      };
      const newArtist = { ID: 1, ...dto, Actived: true };

      jest.spyOn(repository, 'create').mockReturnValue(newArtist as any);
      jest.spyOn(repository, 'save').mockResolvedValue(newArtist as any);

      const result = await service.create(dto);
      expect(result).toEqual(newArtist);
    });
  });

  describe('findAll', () => {
    it('should return paginated and filtered list of artists', async () => {
      const paginationDto: PaginatedQueryDTO = { page: 1, limit: 2, Name: 'John' };
      const artists = [
        { ID: 1, Name: 'John Doe', ArtisProfession: 'Painter', Actived: true },
        { ID: 2, Name: 'John Smith', ArtisProfession: 'Sculptor', Actived: true },
      ];

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([artists, 2]),
      } as any);

      const result = await service.findAll(paginationDto);
      expect(result.data).toEqual(artists);
      expect(result.count).toBe(2);
    });
  });

  describe('findOne', () => {
    it('should return an artist by ID', async () => {
      const artist = { ID: 1, Name: 'John Doe', ArtisProfession: 'Painter', Actived: true };
      jest.spyOn(repository, 'findOne').mockResolvedValue(artist as any);

      const result = await service.findOne(1);
      expect(result).toEqual(artist);
    });

    it('should throw NotFoundException if artist not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  

    describe('update', () => {
        it('should throw NotFoundException if artist not found', async () => {
          jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      
          await expect(service.update(1, {} as CreateLocalArtistDTO)).rejects.toThrow(NotFoundException);
        });
      });
      
  });

  describe('downArtist', () => {
    it('should set Actived to false and return the updated artist', async () => {
      const artist = { ID: 1, Name: 'John Doe', ArtisProfession: 'Painter', Actived: true };
      const updatedArtist = { ...artist, Actived: false };

      jest.spyOn(repository, 'findOne').mockResolvedValue(artist as any);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedArtist as any);

      const result = await service.DownArtist(1);
      expect(result.Actived).toBe(false);
    });

    it('should throw NotFoundException if artist not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.DownArtist(1)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if artist is already inactive', async () => {
      const artist = { ID: 1, Name: 'John Doe', ArtisProfession: 'Painter', Actived: false };
      jest.spyOn(repository, 'findOne').mockResolvedValue(artist as any);

      await expect(service.DownArtist(1)).rejects.toThrow(BadRequestException);
    });
  });
});
