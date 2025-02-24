import { Request } from 'express';
import { RedisService } from 'src/redis/redis.service';

import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserService } from './user/user.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(UserService)
  private userService: UserService;

  @Inject()
  private reflector: Reflector;

  @Inject(RedisService)
  private redisService: RedisService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    /*
      因为这个 PermissionGuard 在 LoginGuard 之后调用（在 AppModule 里声明在 LoginGuard 之后），所以走到这里 request 里就有 user 对象了。

      但也不一定，因为 LoginGuard 没有登录也可能放行，所以要判断下 request.user 如果没有，这里也放行。
    
    */
    if (!request.user) {
      return true;
    }

    /**
     * 从redis里读取
     */
    let permissions: string[] = await this.redisService.listGet(
      `user_${request.user.username}_roles`,
    );

    if (!permissions.length) {
      const roles = await this.userService.findRolesByIds(
        request.user.roles.map((r) => r.id),
      );

      // 获取权限的name list
      permissions = roles
        .reduce((total, next) => {
          total.push(...next.permissions);
          return total;
        }, [])
        .map((v) => v.name);

      // 存储到redis
      this.redisService.listSet(
        `user_${request.user.username}_roles`,
        permissions,
      );
    }

    // 获取class 和 handle 上的权限
    const requirePermissions = this.reflector.getAllAndOverride<string[]>(
      'require-permission',
      [context.getHandler(), context.getClass()],
    );

    // 根据class 和 handle 上的权限 能否在角色的权限找到， 找到就放行
    for (let i = 0; i < requirePermissions.length; i++) {
      const curPermission = requirePermissions[i];
      const find = permissions.find((f) => f === curPermission);

      if (!find) {
        throw new UnauthorizedException('您没有此接口权限');
      }
    }

    return true;
  }
}
