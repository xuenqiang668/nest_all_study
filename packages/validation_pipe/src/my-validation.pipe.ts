import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import {
  ArgumentMetadata,
  BadRequestException,
  Inject,
  Injectable,
  Optional,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class MyValidationPipe implements PipeTransform {
  @Optional()
  @Inject('validation_options')
  private options;

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype) return value;

    console.log(this.options);

    const object = plainToInstance(metatype, value);

    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException('参数验证失败');
    }
    return value;
  }
}
