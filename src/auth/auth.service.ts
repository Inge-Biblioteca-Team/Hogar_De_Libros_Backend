/* eslint-disable prettier/prettier */
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MailService } from './email.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(email);
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.cedula, email: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async login(email: string, password: string): Promise<{ token: string }> {
    const user = await this.usersService.findOne(email);

    if (!user) {
      throw new HttpException('Correo no registrado.', HttpStatus.BAD_REQUEST);
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new HttpException('Contraseña incorrecta.', HttpStatus.BAD_REQUEST);
    }

    const token = this.jwtService.sign({ id: user.cedula, role: user.role });
    return { token };
  }

  async sendPasswordReset(email: string, cedula: string): Promise<void> {
    const user = await this.usersService.findUser(email, cedula);

    if (!user) {
      throw new HttpException('No registrado.', HttpStatus.BAD_REQUEST);
    }

    const token = this.jwtService.sign(
      { id: user.cedula },
      { expiresIn: '1h' },
    );
    const resetLink = `http://localhost:5173/reset-password?token=${token}`;

    await this.mailService.sendPasswordReset(
      user.email,
      `
      <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
      <a href="${resetLink}"> recuperar contraseña </a>`,
      'Restablecer tu contraseña',
    );
  }
}
