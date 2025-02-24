import { UserModule } from 'src/user/user.module';

import { Module } from '@nestjs/common';

import { AaaController } from './aaa.controller';
import { AaaService } from './aaa.service';

@Module({
  imports: [UserModule],
  controllers: [AaaController],
  providers: [AaaService],
})
export class AaaModule {}
