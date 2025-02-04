/* import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from './email.service';
import { UserProfile } from './dto/UserProfileDTO'; // Importa el DTO correctamente
import * as bcrypt from 'bcrypt';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let mailService: MailService;

  const mockUser: UserProfile = {
    cedula: '123456789',
    email: 'test@example.com',
    name: 'John',
    lastName: 'Doe',
    phoneNumber: '12345678',
    province: 'San José',
    district: 'Central',
    gender: 'M',
    address: 'Some address',
    birthDate: new Date('1990-01-01'),
    role: 'user',
    loanPolicity: 3,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findOne: jest.fn(),
            findUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: MailService,
          useValue: {
            sendPasswordReset: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    mailService = module.get<MailService>(MailService);
  });

  it('should log in successfully with valid credentials', async () => {
    jest.spyOn(userService, 'findOne').mockResolvedValue({
      ...mockUser,
      password: 'hashedPassword',
    });
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
    jest.spyOn(jwtService, 'signAsync').mockResolvedValue('validAccessToken');

    const result = await authService.LogIn(mockUser.email, 'validPassword');

    expect(result).toEqual({
      accessToken: 'validAccessToken',
      user: mockUser,
      message: `Éxito al iniciar sesión bienvenido ${mockUser.name}.`,
    });
  });

  it('should throw NotFoundException if user does not exist', async () => {
    jest.spyOn(userService, 'findOne').mockResolvedValue(null);

    await expect(authService.LogIn(mockUser.email, 'validPassword')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw UnauthorizedException if password is incorrect', async () => {
    jest.spyOn(userService, 'findOne').mockResolvedValue({
      ...mockUser,
      password: 'hashedPassword',
    });
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

    await expect(authService.LogIn(mockUser.email, 'invalidPassword')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should send a password reset email if user exists', async () => {
    jest.spyOn(userService, 'findUser').mockResolvedValue(mockUser);
    jest.spyOn(jwtService, 'sign').mockReturnValue('resetToken');
    const sendPasswordResetSpy = jest.spyOn(mailService, 'sendPasswordReset').mockResolvedValue();

    await authService.sendPasswordReset(mockUser.email, mockUser.cedula);

    expect(sendPasswordResetSpy).toHaveBeenCalledWith(
      mockUser.email,
      `${process.env.CLIENT_URL}/reset-password?token=resetToken`,
      `~${mockUser.name} ${mockUser.lastName}`,
    );
  });

  it('should throw HttpException if user does not exist for password reset', async () => {
    jest.spyOn(userService, 'findUser').mockResolvedValue(null);

    await expect(
      authService.sendPasswordReset(mockUser.email, mockUser.cedula),
    ).rejects.toThrow('No registrado.');
  });
});
 */