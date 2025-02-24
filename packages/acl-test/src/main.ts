import * as session from 'express-session';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /*
    secret 是加密 cookie 的密钥。

    resave 是 session 没变的时候要不要重新生成 cookie。

    saveUninitialized 是没登录要不要也创建一个 session。
  */
  app.use(
    session({
      secret: 'xeq',
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
