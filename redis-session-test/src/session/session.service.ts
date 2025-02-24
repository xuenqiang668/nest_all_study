import { RedisService } from 'src/redis/redis.service';

import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class SessionService {
  @Inject(RedisService)
  private redisService: RedisService;

  async setSession(
    sid: string,
    value: Record<string, any>,
    ttl: number = 30 * 60,
  ) {
    if (!sid) {
      sid = this.generateSid();
    }
    await this.redisService.hashSet(`sid${sid}`, value, ttl);
    return sid;
  }
  async getSession<SessionType extends Record<string, any>>(
    sid: string,
  ): Promise<SessionType>;
  async getSession(sid: string) {
    return await this.redisService.hashGet(`sid${sid}`);
  }
  generateSid() {
    return Math.random().toString().slice(2, 12);
  }
}
