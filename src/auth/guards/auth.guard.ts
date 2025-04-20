/* eslint-disable prettier/prettier */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../constants';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);
    if (!token) {
      throw new UnauthorizedException('Token no encontrado');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      request['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }

    return true;
  }

  private extractToken(request: Request): string | undefined {
    const userAgent = request.headers['user-agent'] || '';
    const isIOS = /iPhone|iPad|iPod/i.test(userAgent);

    if (isIOS) {
      const authHeader = request.headers['authorization'];
      if (authHeader?.startsWith('Bearer ')) {
        return authHeader.split(' ')[1]; 
      }
    }

    return request.cookies?.access_token;
  }
}
