import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Query,
} from '@nestjs/common';

import { AppService } from './app.service';
import { RedisService } from './redis/redis.service';

type posQueryType = {
  posName: string;
  longitude: number;
  latitude: number;
};

type nearByQueryType = Omit<posQueryType, 'posName'> & { radius: number };

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Inject(RedisService)
  private redisService: RedisService;

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('addPos')
  async addPos(@Query() posQuery: posQueryType) {
    if (!posQuery.posName || !posQuery.latitude || !posQuery.longitude) {
      throw new BadRequestException('信息不全');
    }

    try {
      await this.redisService.geoAdd('position', posQuery.posName, [
        posQuery.longitude,
        posQuery.latitude,
      ]);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
    return {
      message: '添加成功',
      statusCode: 200,
    };
  }

  @Get('allPos')
  async allPos() {
    return this.redisService.geoList('position');
  }

  @Get('pos')
  async pos(@Query('posName') posName: string) {
    return this.redisService.geoPos('position', posName);
  }

  @Get('nearbySearch')
  async nearbySearch(@Query() query: nearByQueryType) {
    return this.redisService.geoSearch(
      'position',
      [query.longitude, query.latitude],
      query.radius,
    );
  }
}
