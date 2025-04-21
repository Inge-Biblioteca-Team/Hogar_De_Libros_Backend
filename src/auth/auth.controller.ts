/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Res,
  Req,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { SignInDto } from './dto/sign-in.dto';
import { SendPasswordResetDto } from './dto/password-reset.dto';
import { Request, Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() signInDto: SignInDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const result = await this.authService.LogIn(
      signInDto.username,
      signInDto.password,
    );

    if (result.accessToken) {
      if (this.isIOS(req)) {
        return res.json({
          accessToken: result.accessToken,
          user: result.user,
          message: result.message,
        });
      } else {
        res.cookie('access_token', result.accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 86400000,
          sameSite: 'none',
        });
        return res.json({
          user: result.user,
          message: result.message,
        });
      }
    } else {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: result.message });
    }
  }

  @Post('send-password-reset')
  @HttpCode(HttpStatus.OK)
  async sendPasswordReset(
    @Body() sendPasswordResetDto: SendPasswordResetDto,
  ): Promise<void> {
    const { email, cedula } = sendPasswordResetDto;
    await this.authService.sendPasswordReset(email, cedula);
  }

  @Post('/logout')
  async logout(@Res() res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    res.status(200).send({ message: 'Éxito al cerrar sesión' });
  }

  @Post('Profile')
  async loginWithToken(@Req() req: Request, @Res() res: Response) {
    const token =
      req.cookies['access_token'] || this.extractTokenFromHeader(req);
    if (!token) {
      return res
        .status(401)
        .json({ message: 'No se encontró un token de autenticación' });
    }
    try {
      const result = await this.authService.getProfileWhitToken(token);
      if (!this.isIOS(req)) {
        res.cookie('access_token', result.accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 86400000,
          sameSite: 'none',
        });
      }
      return res.status(200).json({
        user: result.user,
        message: result.message,
      });
    } catch (error) {
      res.clearCookie['access_token'];
      const errorMessage =
        (error as Error).message || 'Error al procesar la solicitud';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  private extractTokenFromHeader(req: Request): string | undefined {
    const authHeader = req.headers['authorization'];
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }
    return undefined;
  }

  private isIOS(req: Request): boolean {
    const userAgent = req.headers['user-agent'] || '';
    return /iPhone|iPad|iPod/i.test(userAgent);
  }
}
