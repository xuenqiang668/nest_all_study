import { Request } from 'express';
import { Observable } from 'rxjs';

import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

declare module 'express-session' {
  interface Session {
    user: {
      username: string;
    };
  }
}

@Injectable()
export class LoginGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    if (!request.session?.user)
      throw new HttpException('没有登录', HttpStatus.ACCEPTED);

    return true;
  }
}
