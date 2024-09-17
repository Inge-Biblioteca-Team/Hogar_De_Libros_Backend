/* eslint-disable prettier/prettier */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true; // Si no hay roles requeridos, se permite el acceso
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Verifica si el usuario tiene al menos uno de los roles permitidos
    return requiredRoles.includes(user.role);
  }
}
