import { createReadStream, createWriteStream } from 'node:fs';
import { Transform } from 'node:stream';

const rs = createReadStream('./file.txt', {});
const newFile = createWriteStream('./newFile.txt', {});

class Uppercase extends Transform {
	// we’re overriding the _transform() method with our transformation logic
	_transform(chunk, encoding, callback) {
		this.push(chunk.toString().toUpperCase());
		callback();
	}
}

rs.pipe(new Uppercase()).pipe(newFile);