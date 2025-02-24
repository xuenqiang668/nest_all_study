import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { UpdateUploadDto } from './dto/update-upload.dto';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      dest: 'new_uploads',
    }),
  )
  async upload(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body,
  ) {
    return await this.uploadService.upload(files, body);
  }

  @Get('checkChunks')
  async checkChunks(@Param('md5') md5) {
    const data = await this.uploadService.checkChunks(md5);
    if (data.length > 0) {
      return {
        data,
        code: 200,
        msg: 'success',
      };
    } else {
      return {
        code: HttpStatus.ACCEPTED,
        data: [],
        msg: 'failed',
      };
    }
  }

  @Post('merge')
  merge(@Body() data) {
    return this.uploadService.merge(data);
  }

  @Get()
  findAll() {
    return this.uploadService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.uploadService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUploadDto: UpdateUploadDto) {
    return this.uploadService.update(+id, updateUploadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.uploadService.remove(+id);
  }
}
