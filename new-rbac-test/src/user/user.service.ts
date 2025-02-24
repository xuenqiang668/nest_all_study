import * as crypto from 'crypto';
import * as fs from 'fs';
import * as rs from 'jsrsasign';
import * as path from 'path';
import { EntityManager } from 'typeorm';

import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersEntity } from './entities/user.entity';

function genRSAKeyPaire() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    // publicKeyEncoding: {
    //   type: 'pkcs1',
    //   format: 'pem',
    // },
    // privateKeyEncoding: {
    //   type: 'pkcs1',
    //   format: 'pem',
    // },
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    },
  });

  return { publicKey, privateKey };
}

const md5 = (str) => {
  const hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest('hex');
};

/**
 * crypto解密  配合 jsrsasign
 * @param encryptedData string
 */
const privateKeyDecrypt = (encryptedData: string) => {
  const privateKey = fs.readFileSync(
    path.join(path.resolve(process.cwd()), 'rsa_private.pem'),
    'utf-8',
  );

  // 私钥解密
  const queryPWD = rs.hextob64(encryptedData);
  const decrypted = crypto
    .privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      Buffer.from(queryPWD.toString(), 'base64'),
    )
    .toString();

  return decrypted;
};

/**
 * crypto加密  配合 jsrsasign
 */

// const publicEncrypt = (data) => {

// }

@Injectable()
export class UserService {
  @InjectEntityManager()
  private entityManager: EntityManager;

  private logger = new Logger();

  async login(loginDto: LoginDto) {
    const found = await this.entityManager.findOne(UsersEntity, {
      where: {
        username: loginDto.username,
      },
    });

    if (!found) throw new HttpException('用户名不存在', HttpStatus.ACCEPTED);

    if (found.password !== md5(privateKeyDecrypt(loginDto.password)))
      throw new HttpException('密码错误', HttpStatus.ACCEPTED);

    return found;
  }

  /**
   *
   * @param registerDto 注册
   * @returns
   */
  async register(registerDto: RegisterDto) {
    const found = await this.entityManager.findOne(UsersEntity, {
      where: {
        username: registerDto.username,
      },
    });

    if (found) throw new HttpException('用户名已存在', HttpStatus.ACCEPTED);

    const user = new UsersEntity();
    user.username = registerDto.username;
    // 注册加密存储
    user.password = md5(privateKeyDecrypt(registerDto.password));
    // user.password = rs.hextob64(registerDto.password);

    try {
      await this.entityManager.save(UsersEntity, user);
      return 'register success';
    } catch (e) {
      this.logger.error(e, UserService);
      return 'register fail';
    }
  }

  /**
   *
   * @param 获取数据的公钥和私钥数据
   * @returns  初始化公钥和私钥   并且可以给前端返回公钥
   */
  initKey() {
    return new Promise((resolve, reject) => {
      fs.readFile(
        path.join(path.resolve(process.cwd()), 'rsa_public.pem'),
        'utf-8',
        (err, data) => {
          if (err) {
            const { publicKey, privateKey } = genRSAKeyPaire();
            // 将公钥放在离线文件里
            fs.writeFileSync(
              path.join(path.resolve(process.cwd()), 'rsa_private.pem'),
              privateKey,
            );
            fs.writeFileSync(
              path.join(path.resolve(process.cwd()), 'rsa_public.pem'),
              publicKey,
            );
          }
          resolve(data);
        },
      );
    });

    // await this.entityManager.save(RsaEntity, rsaEntity);
  }

  testEnToDe() {
    this.initKey(); // init pem
    // jsrsasign

    // node crypto
    // https://atool.online/javascript/27493.html

    // const publicKey = fs.readFileSync(
    //   path.join(path.resolve(process.cwd()), 'rsa_public.pem'),
    //   'utf-8',
    // );

    // const privateKey = fs.readFileSync(
    //   path.join(path.resolve(process.cwd()), 'rsa_private.pem'),
    //   'utf-8',
    // );

    // const encs = crypto
    //   .publicEncrypt(publicKey, Buffer.from(JSON.stringify('st')))
    //   .toString('base64');
    // console.log(encs);

    // // 解密

    // const dec2 = crypto
    //   .privateDecrypt(privateKey, Buffer.from(encs, 'base64'))
    //   .toString();
    // console.log('jsrsasign decrypt: ' + dec2);
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
