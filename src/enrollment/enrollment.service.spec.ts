import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentService } from './enrollment.service';
import { Repository } from 'typeorm';
import { Enrollment } from './enrollment.entity';
import { Course } from '../course/course.entity';
import { User } from 'src/user/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  NotFoundException,
  ForbiddenException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

const mockEnrollmentRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getRawOne: jest.fn().mockResolvedValue({ enrollmentCount: 1 }),
  }),
};

const mockCourseRepository = {
  findOne: jest.fn(),
};

const mockUserRepository = {};

describe('EnrollmentService', () => {
  let service: EnrollmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollmentService,
        {
          provide: getRepositoryToken(Enrollment),
          useValue: mockEnrollmentRepository,
        },
        {
          provide: getRepositoryToken(Course),
          useValue: mockCourseRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<EnrollmentService>(EnrollmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('enrollUser', () => {
    it('should enroll a user successfully', async () => {
      mockCourseRepository.findOne.mockResolvedValue({ capacity: 5 });
      mockEnrollmentRepository.findOne.mockResolvedValue(null);
      mockEnrollmentRepository.create.mockReturnValue({});
      mockEnrollmentRepository.save.mockResolvedValue({});

      await expect(
        service.enrollUser({ userCedula: '123' }, 1),
      ).resolves.toEqual({ message: 'Matrícula registrada con éxito' });
    });

    it('should throw a ConflictException if the course is full', async () => {
        mockCourseRepository.findOne.mockResolvedValue({ capacity: 1 });
        jest.spyOn(service, 'countActiveEnrollmentsByCourse').mockResolvedValue(1);
    
        await expect(service.enrollUser({ userCedula: '123' }, 1)).rejects.toThrow(
          new ConflictException('El curso ya ha alcanzado su capacidad máxima'),
        );
      });
  });

  describe('cancelEnrollment', () => {
    it('should cancel an enrollment successfully', async () => {
      mockEnrollmentRepository.findOne.mockResolvedValue({
        course: { date: new Date(Date.now() + 100000000), courseTime: '10:00' },
        status: 'Activa',
      });
      mockEnrollmentRepository.save.mockResolvedValue({});

      await expect(service.cancelEnrollment(1, '123')).resolves.toEqual({
        message: 'Matrícula cancelada con éxito',
      });
    });

    it('should throw NotFoundException if enrollment does not exist', async () => {
      mockEnrollmentRepository.findOne.mockResolvedValue(null);
      await expect(service.cancelEnrollment(1, '123')).rejects.toThrow(
        NotFoundException,
      );
    });

   
  });
});
