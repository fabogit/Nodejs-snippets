import { createReadStream, createWriteStream } from 'fs';
import { pipeline, Transform } from 'stream';

const uppercase = new Transform({
	transform(chunk, encoding, callback) {
		// Data processing
		callback(null, chunk.toString().toUpperCase());
	}
});

pipeline(
	createReadStream('./file.txt'),
	uppercase,
	createWriteStream('./newFile.txt'),
	(err) => {
		if (err) {
			console.error('Pipeline failed.', err);
		} else {
			console.log('Pipeline succeeded.');
		}
	}
);