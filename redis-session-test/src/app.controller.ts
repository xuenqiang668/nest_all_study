import { Request, Response } from 'express';

import { Controller, Get, Inject, Req, Res } from '@nestjs/common';

import { AppService } from './app.service';
import { RedisService } from './redis/redis.service';
import { SessionService } from './session/session.service';

@Controller()
export class AppController {
  @Inject(SessionService)
  private sessionService: SessionService;
  @Inject(RedisService)
  private redisService: RedisService;

  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('viewRedis')
  viewRedis(@Req() req: Request) {
    const sid = req.cookies?.sid;
    return this.redisService.hashGet(`sid${sid}`);
  }

  @Get('count')
  async count(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const sid = req.cookies?.sid;

    const session = await this.sessionService.getSession<{ count: string }>(
      sid,
    );

    const curCount = session.count ? parseInt(session.count) + 1 : 1;

    const curSid = await this.sessionService.setSession(sid, {
      count: curCount,
    });

    res.cookie('sid', curSid, { maxAge: 1800000 });

    return curCount;
  }
}
