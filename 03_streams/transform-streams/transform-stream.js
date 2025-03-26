import { createReadStream, createWriteStream } from 'node:fs';
import { Transform } from 'node:stream';

const rs = createReadStream('./file.txt',{});
const newFile = createWriteStream('./newFile.txt', {});

const uppercase = new Transform({
	transform(chunk, encoding, callback) {
		// Data processing
		callback(null, chunk.toString().toUpperCase());
	}
});

rs.pipe(uppercase).pipe(newFile);