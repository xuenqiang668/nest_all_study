import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { BbbController } from './bbb.controller';
import { BbbService } from './bbb.service';

@Module({
  imports: [
    ConfigModule.forFeature(() => {
      return {
        myself: 222,
      };
    }),
  ],
  controllers: [BbbController],
  providers: [BbbService],
})
export class BbbModule {}
