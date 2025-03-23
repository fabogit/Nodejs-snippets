import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const filepath = join(process.cwd(), 'hello.txt');

const contents = readFileSync(filepath, 'utf8');
console.log('File Contents:', contents);
const upperContents = contents.toUpperCase();
writeFileSync(filepath, upperContents);
console.log('File updated.');