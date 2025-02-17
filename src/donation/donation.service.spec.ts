import { Test, TestingModule } from '@nestjs/testing';
import { DonationService } from './donation.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Donation } from './donation.entity';
import { User } from 'src/user/user.entity';
import { NotesService } from 'src/notes/notes.service';
import { CreateDonationDTO } from './DTO/create-donation-DTO';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DenyDonationRequestDTO } from './DTO/deny-donation-DTO';

const mockDonationRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    orderBy: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
  }),
};

const mockUserRepository = {
  findOne: jest.fn(),
};

const mockNotesService = {
  createNote: jest.fn(),
};

describe('DonationService', () => {
  let service: DonationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DonationService,
        {
          provide: getRepositoryToken(Donation),
          useValue: mockDonationRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: NotesService,
          useValue: mockNotesService,
        },
      ],
    }).compile();

    service = module.get<DonationService>(DonationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('CreateDonation', () => {
    it('should create a donation successfully', async () => {
      const dto: CreateDonationDTO = {
        UserCedula: '12345678',
        UserFullName: 'John Doe',
        UserAddress: '123 Street',
        UserPhone: '1234567890',
        UserEmail: 'john@example.com',
        SubCategory: 'Books',
        DateRecolatedDonation: '2025-01-01',
        ItemDescription: 'Some books',
        ResourceCondition: 'New',
      };
      const mockDocuments = [{ filename: 'file1.pdf' }] as Express.Multer.File[];
      mockUserRepository.findOne.mockResolvedValue(null);
      mockDonationRepository.create.mockReturnValue(dto);
      mockDonationRepository.save.mockResolvedValue(dto);
      mockNotesService.createNote.mockResolvedValue(undefined);

      const result = await service.CreateDonation(dto, mockDocuments);
      expect(result).toEqual({ message: 'Solicitud de amigo enviada correctamente.' });
    });

    it('should throw an error if creation fails', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      mockDonationRepository.create.mockImplementation(() => {
        throw new Error('Database error');
      });
      await expect(service.CreateDonation({} as CreateDonationDTO, [])).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('getAllDonation', () => {
    it('should return a list of donations', async () => {
      mockDonationRepository.createQueryBuilder().getManyAndCount.mockResolvedValue([[], 0]);
      const result = await service.getAllDonation({ page: 1, limit: 10 });
      expect(result).toEqual({ data: [], count: 0 });
    });
  });

  describe('aproveDonation', () => {
    it('should approve a donation', async () => {
      const mockDonation = { DonationID: 1, Status: 'Pending' };
      mockDonationRepository.findOne.mockResolvedValue(mockDonation);
      mockDonationRepository.save.mockResolvedValue(mockDonation);

      const result = await service.aproveDonation(1);
      expect(result).toEqual({ message: 'Solicitud de donacion aprobada correctamente' });
    });

    it('should throw NotFoundException if donation does not exist', async () => {
      mockDonationRepository.findOne.mockResolvedValue(null);
      await expect(service.aproveDonation(1)).rejects.toThrow('Solicitud de donacion no encontrada');
    });
  });

  describe('denyDonation', () => {
    it('should deny a donation', async () => {
      const mockDonation = { DonationID: 1, Status: 'Pending', Reason: '' };
      mockDonationRepository.findOne.mockResolvedValue(mockDonation);
      mockDonationRepository.save.mockResolvedValue(mockDonation);
      const dto: DenyDonationRequestDTO = { reason: 'Not eligible' };

      const result = await service.denyDonation(1, dto);
      expect(result).toEqual({ message: 'Solicitud de donacion rechazada correctamente' });
    });

    it('should throw NotFoundException if donation does not exist', async () => {
      mockDonationRepository.findOne.mockResolvedValue(null);
      await expect(service.denyDonation(1, { reason: 'Not eligible' })).rejects.toThrow('Solicitud de donacion no encontrada');
    });
  });

  describe('confirmDonation', () => {
    it('should confirm a donation', async () => {
      const mockDonation = { DonationID: 1, Status: 'Pending', Reason: '' };
      mockDonationRepository.findOne.mockResolvedValue(mockDonation);
      mockDonationRepository.save.mockResolvedValue(mockDonation);
      const dto: DenyDonationRequestDTO = { reason: 'Received' };

      const result = await service.confirmDonation(1, dto);
      expect(result).toEqual({ message: 'Solicitud de donacion rechazada correctamente' });
    });

    it('should throw NotFoundException if donation does not exist', async () => {
      mockDonationRepository.findOne.mockResolvedValue(null);
      await expect(service.confirmDonation(1, { reason: 'Received' })).rejects.toThrow('Solicitud de donacion no encontrada');
    });
  });
});
