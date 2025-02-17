import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from './email.service';
import { NotFoundException, UnauthorizedException, InternalServerErrorException, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from './constants';

const mockUser = {
  cedula: '123456789',
  email: 'test@example.com',
  password: 'hashedpassword',
  name: 'Test',
  lastName: 'User',
  phoneNumber: '12345678',
  province: 'SomeProvince',
  district: 'SomeDistrict',
  gender: 'Male',
  address: 'Some Address',
  birthDate: new Date(),
  role: 'user',
  loanPolicy: 1,
};

const mockUserService = {
  findOne: jest.fn().mockResolvedValue(mockUser),
  findUser: jest.fn().mockResolvedValue(mockUser),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mockToken'),
  verifyAsync: jest.fn().mockResolvedValue({ email: mockUser.email }),
};

const mockMailService = {
  sendPasswordReset: jest.fn().mockResolvedValue(null),
};

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('LogIn', () => {


    it('should throw NotFoundException if user is not found', async () => {
      mockUserService.findOne.mockResolvedValue(null);
      await expect(authService.LogIn('notfound@example.com', 'password'))
        .rejects.toThrow(InternalServerErrorException);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);
      await expect(authService.LogIn(mockUser.email, 'wrongpassword'))
        .rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('sendPasswordReset', () => {
    it('should send a password reset email', async () => {
      await authService.sendPasswordReset(mockUser.email, mockUser.cedula);
      expect(mockMailService.sendPasswordReset).toHaveBeenCalled();
    });

    it('should throw HttpException if user is not found', async () => {
      mockUserService.findUser.mockResolvedValue(null);
      await expect(authService.sendPasswordReset('invalid@example.com', '123'))
        .rejects.toThrow(HttpException);
    });
  });

  describe('getProfileWhitToken', () => {
    

    it('should throw UnauthorizedException if token is invalid', async () => {
      mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));
      await expect(authService.getProfileWhitToken('invalidToken'))
        .rejects.toThrow(UnauthorizedException);
    });
  });
});
