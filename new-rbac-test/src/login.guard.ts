import { Request } from 'express';
import { Observable } from 'rxjs';

import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

declare module 'express' {
  interface Request {
    user: {
      username: string;
      id: number;
    };
  }
}

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject()
  private reflector: Reflector;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    // 对必须要token的接口进行验证
    const require = this.reflector.getAllAndOverride('require-login', [
      context.getClass(),
      context.getHandler(),
    ]);

    if (!require) {
      return true;
    }

    const authorization = request.header('authorization') || '';

    if (!authorization) throw new UnauthorizedException('用户未登录');

    try {
      const token = authorization.split(' ')[1];
      const { user } = this.jwtService.verify(token);

      request.user = user;

      return true;
    } catch (e) {
      throw new UnauthorizedException('TOKEN 失效，请重新登录');
    }

    return true;
  }
}
