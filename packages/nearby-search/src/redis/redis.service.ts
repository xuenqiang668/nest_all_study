import { RedisClientType } from 'redis';

import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;

  async geoAdd(key: string, posName: string, posLoc: [number, number]) {
    return await this.redisClient.geoAdd(key, {
      longitude: posLoc[0],
      latitude: posLoc[1],
      member: posName,
    });
  }

  // 获取 pos 对应key 的信息
  async geoPos(key: string, posName: string) {
    const res = await this.redisClient.geoPos(key, posName);

    return {
      name: posName,
      longitude: res[0],
      latitude: res[1],
    };
  }

  // 获取多个key 的信息

  async geoList(key: string) {
    // 因为 geo 信息底层使用 zset 存储的，所以查询所有的 key 使用 zrange。
    // zset 是有序列表，列表项会有一个分数，zrange 是返回某个分数段的 key，传入 0、-1 就是返回所有的。
    const positions = await this.redisClient.zRange(key, 0, -1);

    const list = [];
    for (let i = 0; i < positions.length; i++) {
      const pos = positions[i];
      const res = await this.redisClient.geoPos(key, pos);
      list.push(res);
    }

    return list;
  }

  /**
   * nearby search
   */

  async geoSearch(key: string, pos: [number, number], radius: number) {
    // 对应key
    const positions = await this.redisClient.geoRadius(
      key,
      {
        longitude: pos[0],
        latitude: pos[1],
      },
      radius,
      'km',
    );

    const list = [];
    for (let i = 0; i < positions.length; i++) {
      const posName = positions[i];
      const res = await this.geoPos(key, posName);
      list.push(res);
    }

    return list;
  }
}
