import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  
  @Injectable()
  export class SwaggerAuthInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();
      const token = request.cookies?.accessToken;
  
      if (token) {
        request.headers['authorization'] = `Bearer ${token}`;
      }
  
      return next.handle();
    }
  }
  