import { createReadStream } from 'node:fs';

const rs = createReadStream('file.txt', {});

rs.pipe(process.stdout);