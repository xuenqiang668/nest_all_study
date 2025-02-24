import { Controller, Get } from '@nestjs/common';

import { AccessEntity } from './access/entities/access.entity';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('init')
  getInit() {
    return this.appService.getInit();
  }

  @Get()
  async getHello(): Promise<AccessEntity[]> {
    return await this.appService.getHello();
  }
}
