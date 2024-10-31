import { Test, TestingModule } from '@nestjs/testing';
import { CourseService } from './course.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';
import { CreateCourseDto } from './DTO/create-course.dto';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { EnrollmentService } from 'src/enrollment/enrollment.service';
import { AdvicesService } from 'src/advices/advices.service';

describe('CourseService', () => {
  let service: CourseService;
  let courseRepository: Repository<Course>;
  let enrollmentService: EnrollmentService;
  let adviceService: AdvicesService;

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
          useValue: { countActiveEnrollmentsByCourse: jest.fn() },
        },
        {
          provide: AdvicesService,
          useValue: { createNewAdvice: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<CourseService>(CourseService);
    courseRepository = module.get<Repository<Course>>(getRepositoryToken(Course));
    enrollmentService = module.get<EnrollmentService>(EnrollmentService);
    adviceService = module.get<AdvicesService>(AdvicesService);
  });

  describe('createCourse', () => {
    it('should create a course and return it', async () => {
      const createCourseDto: CreateCourseDto = {
        courseName: 'Test Course',
        date: new Date(),
        courseTime: '10:00',
        location: 'Online',
        instructor: 'John Doe',
        courseType: 'Webinar',
        targetAge: 18,
        capacity: 30,
        image: 'course.jpg',
        duration: '2 hours',
        endDate: new Date(),
        programProgramsId: 0,
        materials: 'Notebook, pen',
      };

      jest.spyOn(courseRepository, 'save').mockResolvedValue({ ...createCourseDto } as Course);
      jest.spyOn(adviceService, 'createNewAdvice').mockResolvedValue(undefined);

      const result = await service.createCourse(createCourseDto);
      expect(result).toMatchObject(createCourseDto);
    });

    it('should throw an error if course creation fails', async () => {
      const createCourseDto: CreateCourseDto = {
        courseName: 'Test Course',
        date: new Date(),
        courseTime: '10:00',
        location: 'Online',
        instructor: 'John Doe',
        courseType: 'Webinar',
        targetAge: 18,
        capacity: 30,
        image: 'course.jpg',
        duration: '2 hours',
        endDate: new Date(),
        programProgramsId: 0,
        materials: 'Notebook, pen',
      };

      jest.spyOn(courseRepository, 'save').mockRejectedValue(new Error('Save error'));

      await expect(service.createCourse(createCourseDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAllCourses', () => {
    it('should return all courses with pagination', async () => {
      const mockCourses = [
        { courseId: 1, courseName: 'Course 1' },
        { courseId: 2, courseName: 'Course 2' },
      ];
      jest.spyOn(courseRepository, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockCourses, 2]),
      } as any);

      const result = await service.findAllCourses({ page: 1, limit: 10 });
      expect(result.data).toEqual(mockCourses);
      expect(result.count).toBe(2);
    });
  });

  describe('updateCourseById', () => {
    it('should update a course by ID and return it', async () => {
      const courseId = 1;
      const updateCourseDto = { courseName: 'Updated Course' };
      const mockCourse = { courseId, courseName: 'Old Course' };

      jest.spyOn(courseRepository, 'findOne').mockResolvedValue(mockCourse as Course);
      jest.spyOn(courseRepository, 'save').mockResolvedValue({
        ...mockCourse,
        ...updateCourseDto,
      } as Course);

      const result = await service.updateCourseById(courseId, updateCourseDto);
      expect(result.courseName).toBe(updateCourseDto.courseName);
    });

    it('should throw NotFoundException if course is not found', async () => {
      const courseId = 1;
      jest.spyOn(courseRepository, 'findOne').mockResolvedValue(null);

      await expect(service.updateCourseById(courseId, {})).rejects.toThrow(NotFoundException);
    });
  });

  it('should disable the course by setting Status to false', async () => {
    const courseId = 1;
    const mockCourse = {
      courseId: 1,
      courseName: 'Test Course',
      Status: true,
    } as Course;

    jest.spyOn(courseRepository, 'findOne').mockResolvedValue(mockCourse);
    jest.spyOn(courseRepository, 'save').mockResolvedValue({
      ...mockCourse,
      Status: false,
    });

    const result = await service.disableCourse(courseId);

    expect(courseRepository.findOne).toHaveBeenCalledWith({ where: { courseId } });
    expect(courseRepository.save).toHaveBeenCalledWith({
      ...mockCourse,
      Status: false,
    });
    expect(result.Status).toBe(false);
  });

  it('should throw NotFoundException if course is not found', async () => {
    jest.spyOn(courseRepository, 'findOne').mockResolvedValue(null);

    await expect(service.disableCourse(999)).rejects.toThrow(NotFoundException);
  });
  

  describe('getNextCourses', () => {
    it('should return next courses within the next 3 months', async () => {
      const mockCourses = [
        { courseId: 1, courseName: 'Next Course 1' },
        { courseId: 2, courseName: 'Next Course 2' },
      ];

      jest.spyOn(courseRepository, 'createQueryBuilder').mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockCourses, 2]),
      } as any);

      const result = await service.getNextCourses({});
      expect(result.data).toEqual(mockCourses);
      expect(result.count).toBe(2);
    });
  });

  describe('CourseList', () => {
    it('should return a list of courses by date', async () => {
      const mockDate = new Date();
      const mockCourses = [{ courseId: 1, courseName: 'Test Course' }];

      jest.spyOn(courseRepository, 'find').mockResolvedValue(mockCourses as Course[]);

      const result = await service.CourseList(mockDate);
      expect(result).toEqual(mockCourses);
    });
  });

  describe('updateExpireCourses', () => {
    it('should update expired courses by setting Status to false', async () => {
      const currentDate = new Date();
      jest.spyOn(courseRepository, 'createQueryBuilder').mockReturnValue({
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue(undefined),
      } as any);

      await expect(service.updateExpireCourses()).resolves.toBeUndefined();
    });
  });
});
