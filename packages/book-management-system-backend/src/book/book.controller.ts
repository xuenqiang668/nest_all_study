import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { BookService } from './book.service';
import { UpdateBookDto } from './dto/update-book.dto';
import { AddBookDto } from './dto/add-book.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from './my-file-storage';
import * as path from 'node:path'
import { async } from 'rxjs';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) { }

  @UseInterceptors(FileInterceptor('file', {
    dest: "uploads",
    storage: storage,
    limits: {
      fileSize: 3 * 1000 * 1024
    },
    fileFilter: (req, file, callback) => {
      const extName = path.extname(file.originalname)
      if (['.png', '.jpg', '.gif'].includes(extName)) {
        callback(null, true);
      } else {
        callback(new BadRequestException('only upload img'), false)
      }
    }
  }))
  @Post('upload')
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file.path);

    return file.path
  }

  @Get('list')
  async list() {
    return this.bookService.list()
  }

  @Get('find/:id')
  async findById(@Param('id') id: number) {
    return this.bookService.findById(id)
  }

  @Post('add')
  async add(@Body() addBookDto: AddBookDto) {
    return this.bookService.add(addBookDto)
  }

  @Put('update')
  async update(@Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(updateBookDto)
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: number) {
    return this.bookService.deleteById(id)
  }
}
