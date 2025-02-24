import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

export default async () => {
  const confFilePath = join(process.cwd(), 'aaa.yaml');

  const config = await readFileSync(confFilePath, {
    encoding: 'utf-8',
  });

  return yaml.load(config);
};
