import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccessModule } from './access/access.module';
import { AccessEntity } from './access/entities/access.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DepartmentModule } from './department/department.module';
import { DepartmentEntity } from './department/entities/department.entity';
import { LoginGuard } from './login.guard';
import { RoleEntity } from './role/entities/role.entity';
import { RoleModule } from './role/role.module';
import { RsaEntity } from './user/entities/rsa.entity';
import { UsersEntity } from './user/entities/user.entity';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'new_rbac_test',
      synchronize: true,
      logging: true,
      entities: [
        UsersEntity,
        DepartmentEntity,
        RoleEntity,
        AccessEntity,
        RsaEntity,
      ],
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: {
        authPlugin: 'sha256_password',
      },
    }),
    JwtModule.register({
      secret: 'xeq',
      global: true,
      signOptions: {
        expiresIn: '7d',
      },
    }),
    RoleModule,
    DepartmentModule,
    AccessModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: LoginGuard,
    },
  ],
})
export class AppModule {}
