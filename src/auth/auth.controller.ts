/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { SignInDto } from './dto/sign-in.dto';
import { SendPasswordResetDto } from './dto/password-reset.dto';
import { Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto, @Res() res: Response) {
    const result = await this.authService.LogIn(
      signInDto.username,
      signInDto.password,
    );

    if (result.accessToken) {
      res.cookie('access_token', result.accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 86400000,
      });
      return res.json({
        user: result.user,
        message: result.message,
      });
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
}
