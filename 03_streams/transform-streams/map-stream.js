import { createReadStream, createWriteStream } from 'node:fs';

const rs = createReadStream('./file.txt');
const newFile = createWriteStream('./newFile.txt');

rs.map((chunk) => chunk.toString().toUpperCase()).pipe(newFile);