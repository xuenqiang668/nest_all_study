import { Controller, Get, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppService } from './app.service';

@Controller()
export class AppController {
  @Inject(ConfigService)
  private configService: ConfigService;

  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): Object {
    // return this.appService.getHello();
    return {
      // aaa: this.configService.get('aaa'),
      // bbb: this.configService.get('bbb'),
      db: this.configService.get('db'),
      config: this.configService.get('aaa.bbb'),
    };
  }
}
