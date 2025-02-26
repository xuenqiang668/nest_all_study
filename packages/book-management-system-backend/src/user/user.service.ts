import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { DbService } from '../db/db.service';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  @Inject(DbService)
  private dbService: DbService

  async register(registerUserDto: RegisterUserDto) {
    const users: User[] = await this.dbService.read()
    console.log(users);


    const foundUser = users.find(f => f.username == registerUserDto.username)
    if (foundUser) {
      throw new BadRequestException('该用户已经注册')
    }

    const user = new User()
    user.username = registerUserDto.username
    user.password = registerUserDto.password

    users.push(user)



    await this.dbService.write(users)

    return user
  }


  async login(loginUserDto: LoginUserDto) {
    const users: User[] = await this.dbService.read()




    const foundUser = users.find(f => f.username == loginUserDto.username)

    if (!foundUser) {
      throw new BadRequestException("username is found")
    }

    if (foundUser.password !== loginUserDto.password) {
      throw new BadRequestException('The password is incorrect')
    }

    if (foundUser) {
      return {
        data: foundUser,
        status: 200
      }
    }
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
