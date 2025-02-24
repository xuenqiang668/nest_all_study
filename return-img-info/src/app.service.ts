import * as fs from 'node:fs';
import * as path from 'node:path';

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    const filePath = path.join(process.cwd(), 'img/1_Vehicles/');
    console.log(filePath);

    fs.readdir(filePath, (err, data) => {
      console.log(data);
    });

    return 'Hello World!';
  }
}
