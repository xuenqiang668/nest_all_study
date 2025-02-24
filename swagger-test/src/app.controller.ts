import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AppService } from './app.service';
import { CccDto } from './cccDto';
import { CccVo } from './cccvo';

/**
  dto 是 data transfer object，用于参数的接收。

  vo 是 view object，用于返回给视图的数据的封装。

  而 entity 是和数据库表对应的实体类。 

 */

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiTags('xxx-get')
  @ApiBasicAuth('bearer')
  @ApiOperation({ summary: '测试aaa', description: 'aa 描述' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'aaa 成功',
    type: String,
  })
  @ApiQuery({
    name: 'a1',
    type: String,
    description: 'a1 param',
    required: false,
    example: '1111',
  })
  @ApiQuery({
    name: 'a2',
    type: Number,
    description: 'a2 param',
    required: true,
    example: 2222,
  })
  @Get('aaa')
  aaa(@Query('a1') a1, @Query('a2') a2) {
    console.log(a1, a2);
    return 'aaa success';
  }

  @ApiTags('xxx-get')
  @ApiCookieAuth('cookie')
  @ApiOperation({ summary: '测试 bbb', description: 'bbb 描述' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'bbb 成功',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'id 不合法',
  })
  @ApiParam({
    name: 'id',
    description: 'ID',
    required: true,
    example: 222,
  })
  @Get('bbb/:id')
  bbb(@Param('id') id) {
    console.log(id);
    if (id !== 111) {
      throw new UnauthorizedException();
    }
    return 'bbb success';
  }

  @ApiOperation({ summary: '测试 ccc' })
  @ApiBasicAuth('basic')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ccc 成功',
    type: CccVo,
  })
  @ApiBody({
    type: CccDto,
  })
  @Post('ccc')
  ccc(@Body('ccc') ccc: CccDto) {
    console.log(ccc);

    const vo = new CccVo();
    vo.aaa = 111;
    vo.bbb = 222;
    return vo;
  }
}
