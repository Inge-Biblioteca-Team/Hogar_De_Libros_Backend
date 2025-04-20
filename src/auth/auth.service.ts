/* eslint-disable prettier/prettier */
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MailService } from './email.service';
import { UserProfile } from './dto/UserProfileDTO';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async LogIn(
    email: string,
    pass: string,
  ): Promise<{ accessToken?: string; user?: UserProfile; message: string }> {
    try {
      const user = await this.usersService.findOne(email);
      if (!user) {
        throw new NotFoundException(
          'El usuario no existe por favor revise sus datos.',
        );
      }
      if(!user.status){
        throw new ForbiddenException('El usuario se encuentra inactivo. Si desea más información, comuníquese con la biblioteca.');
      }
      const isMatch = await bcrypt.compare(pass, user.password);
      if (!isMatch) {
        throw new UnauthorizedException(
          'Contraseña incorrecta vuelva a intentar.',
        );
      }

      const payload = { sub: user.cedula, email: user.email, role: user.role };
      const accessToken = await this.jwtService.signAsync(payload);

      const userProfile: UserProfile = {
        cedula: user.cedula,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        province: user.province,
        district: user.district,
        gender: user.gender,
        address: user.address,
        birthDate: user.birthDate,
        role: user.role,
        loanPolicity: user.loanPolicy,
      };

      return {
        accessToken: accessToken,
        user: userProfile,
        message: `Éxito al iniciar sesión bienvenido ${user.name}.`,
      };
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Error al iniciar sesión';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async sendPasswordReset(email: string, cedula: string): Promise<void> {
    const user = await this.usersService.findUser(email, cedula);

    if (!user) {
      throw new HttpException('No registrado.', HttpStatus.BAD_REQUEST);
    }
    const userFullName = `~${user.name} ${user.lastName}`;

    const token = this.jwtService.sign(
      { id: user.cedula },
      { expiresIn: '1h' },
    );
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    await this.mailService.sendPasswordReset(
      user.email,
      resetLink,
      userFullName,
    );
  }

  async getProfileWhitToken(
    token: string,
  ): Promise<{ accessToken: string; user: UserProfile; message: string }> {
    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      const email = decoded.email;
      const user = await this.usersService.findOne(email);
      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }
      const userProfile: UserProfile = {
        cedula: user.cedula,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        province: user.province,
        district: user.district,
        gender: user.gender,
        address: user.address,
        birthDate: user.birthDate,
        role: user.role,
        loanPolicity: user.loanPolicy,
      };

      const payload = { sub: user.cedula, email: user.email, role: user.role };
      const NewAccessToken = await this.jwtService.signAsync(payload);

      return {
        accessToken: NewAccessToken,
        user: userProfile,
        message: `Bienvenido de nuevo ${user.name}.`,
      };
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
