import { EntityManager } from 'typeorm';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

// type A = 'a' | 'b'

// type IdType = Extract<A, 'a'>;

@Injectable()
export class UserService {
  @InjectEntityManager()
  private entityManager: EntityManager;

  async login(loginUserDto: LoginUserDto) {
    const user = await this.entityManager.findOne(User, {
      where: {
        username: loginUserDto.username,
      },
    });

    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.OK);
    }

    if (user.password !== loginUserDto.password) {
      throw new HttpException('密码错误', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return user;
  }

  async findUserById(id: number) {
    return await this.entityManager.findOne(User, {
      where: {
        id,
      },
    });
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
