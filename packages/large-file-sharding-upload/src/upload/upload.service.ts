import * as fs from 'node:fs';
import * as path from 'node:path';

import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { Upload } from './entities/upload.entity';

@Injectable()
export class UploadService {
  @InjectRepository(Upload)
  private uploadRepository: Repository<Upload>;

  create(createUploadDto: CreateUploadDto) {
    return 'This action adds a new upload';
  }

  async upload(files, body) {
    // console.log(files, body);
    const {
      totalNumber, // 分片总数
      chunkNumber, // 分片序号
      chunkSize, // 分片大小
      md5, // 文件hash值（唯一）
      name,
    } = body;

    //指定hash文件路径
    const chunkPath = path.join('new_uploads', md5, '/');
    if (!fs.existsSync(chunkPath)) {
      fs.mkdirSync(chunkPath);
    }
    //移动文件到指定目录
    fs.cpSync(files[0].path, chunkPath + md5 + '-' + chunkNumber);
    const upload = new Upload();
    upload.file_hash = md5;
    upload.chunck_number = chunkNumber;
    upload.chunck_size = chunkSize;
    upload.file_name = name;
    upload.chunck_total_number = totalNumber;

    await this.uploadRepository.save(upload);
    return {
      code: 200,
      msg: 'success',
    };
  }

  merge(data) {
    const { totalNumber, md5, name } = data;
    try {
      //分片存储得文件夹路径
      const chunckPath = path.join('new_uploads', md5, '/');
      //创建合并后的文件
      console.log(name + '我是视频地址');
      const filePath = path.join('new_uploads', name);
      //读取对应hash文件夹下的所有分片文件名称
      const chunckList = fs.existsSync(chunckPath)
        ? fs.readdirSync(chunckPath)
        : [];
      console.log(chunckList + '我是视频地址');
      //创建储存文件
      fs.writeFileSync(filePath, '');
      //判断切片是否完整
      console.log(chunckList.length, totalNumber, '我是总地址，和分片地址');
      if (chunckList.length !== totalNumber) {
        process.exit();
        // return {
        //   status: 500,
        //   message: 'Merge failed, missing file slices',
        // };
        // ctx.res.end('error');
      }
      for (let i = 0; i < totalNumber; i++) {
        const chunck = fs.readFileSync(chunckPath + md5 + '-' + i);
        //写入当前切片
        fs.appendFileSync(filePath, chunck);
        //删除已合并的切片
        fs.unlinkSync(chunckPath + md5 + '-' + i);
      }
      //删除空文件夹
      fs.rmdirSync(chunckPath);
      return {
        status: 200,
        message: 'success',
      };
    } catch (e) {
      return {
        status: 500,
        message: '合并失败',
      };
    }
  }

  async checkChunks(md5) {
    return await this.uploadRepository.find({
      where: {
        file_hash: md5,
      },
    });
  }

  findAll() {
    return `This action returns all upload`;
  }

  findOne(id: number) {
    return `This action returns a #${id} upload`;
  }

  update(id: number, updateUploadDto: UpdateUploadDto) {
    return `This action updates a #${id} upload`;
  }

  remove(id: number) {
    return `This action removes a #${id} upload`;
  }
}
