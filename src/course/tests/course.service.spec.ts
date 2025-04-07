import { Test, TestingModule } from '@nestjs/testing';
import { CourseService } from './course.service';
import { Repository } from 'typeorm';
import { Course } from './course.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EnrollmentService } from 'src/enrollment/enrollment.service';
import { AdvicesService } from 'src/advices/advices.service';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateCourseDto } from './DTO/create-course.dto';

describe('CourseService', () => {
  let service: CourseService;
  let repository: Repository<Course>;
  let enrollmentService: EnrollmentService;
  let advicesService: AdvicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseService,
        {
          provide: getRepositoryToken(Course),
          useClass: Repository,
        },
        {
          provide: EnrollmentService,
          useValue: {
            countActiveEnrollmentsByCourse: jest.fn(),
          },
        },
        {
          provide: AdvicesService,
          useValue: {
            createNewAdvice: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CourseService>(CourseService);
    repository = module.get<Repository<Course>>(getRepositoryToken(Course));
    enrollmentService = module.get<EnrollmentService>(EnrollmentService);
    advicesService = module.get<AdvicesService>(AdvicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCourse', () => {
    it('should create and return a success message', async () => {
        const mockCourseDto: CreateCourseDto = {
            courseName: 'Curso de NestJS',
            date: new Date(),
            image: 'https://example.com/image.jpg',
            location: 'Sala A',
            instructor: 'John Doe',
            courseTime: '10:00 AM',
            courseType: 'Tecnología',
            targetAge: 18,
            capacity: 20,
            endDate: new Date(),
            materials: 'Laptop, cuaderno',
            programProgramsId: 1,
          };
      const savedCourse = { courseId: 1, ...mockCourseDto };
      jest.spyOn(repository, 'create').mockReturnValue(savedCourse as Course);
      jest.spyOn(repository, 'save').mockResolvedValue(savedCourse as Course);
      jest.spyOn(advicesService, 'createNewAdvice').mockResolvedValue(undefined);

      const result = await service.createCourse(mockCourseDto);
      expect(result).toEqual({ message: 'Éxito al añadir el curso' });
    });

    it('should throw an InternalServerErrorException on error', async () => {
      jest.spyOn(repository, 'save').mockRejectedValue(new Error('Database error'));
      await expect(service.createCourse({} as any)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findAllCourses', () => {
    it('should return a list of courses with count', async () => {
      const courses = [{ courseId: 1, courseName: 'Test Course', date: new Date(), Status: true }];
      jest.spyOn(repository, 'createQueryBuilder').mockImplementation(() => {
        return {
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          orderBy: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          skip: jest.fn().mockReturnThis(),
          take: jest.fn().mockReturnThis(),
          getManyAndCount: jest.fn().mockResolvedValue([courses, 1]),
        } as any;
      });

      const result = await service.findAllCourses({ page: 1, limit: 10 });
      expect(result).toEqual({ data: expect.any(Array), count: 1 });
    });
  });

  describe('disableCourse', () => {
    it('should disable a course', async () => {
      const course = { courseId: 1, Status: true } as Course;
      jest.spyOn(repository, 'findOne').mockResolvedValue(course);
      jest.spyOn(repository, 'save').mockResolvedValue({ ...course, Status: false });

      const result = await service.disableCourse(1);
      expect(result).toEqual({ message: 'Curso cancelado con éxito' });
    });

    it('should throw NotFoundException if course does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      await expect(service.disableCourse(1)).rejects.toThrow(NotFoundException);
    });
  });
});
