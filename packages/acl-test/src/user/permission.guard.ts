import { Request } from 'express';

import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { RedisService } from '../redis/redis.service';
import { UserService } from './user.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(UserService)
  private userService: UserService;

  @Inject(Reflector)
  private reflector: Reflector;

  @Inject(RedisService)
  private redisService: RedisService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const user = request.session.user;

    if (!user) {
      throw new UnauthorizedException('用户未登录');
    }

    let permissions = await this.redisService.listGet(
      `user_${user.username}_permissions`,
    );

    if (permissions.length === 0) {
      const foundUser = await this.userService.findByUsername(user.username);
      permissions = foundUser.permissions.map((v) => v.name);

      await this.redisService.listSet(
        `user_${user.username}_permissions`,
        permissions,
      );
    }

    console.log(permissions);

    const permission = this.reflector.get('permission', context.getHandler());

    if (permissions.some((s) => s === permission)) {
      return true;
    } else {
      throw new UnauthorizedException('没有权限访问');
    }
  }
}
