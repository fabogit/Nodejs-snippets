import { createReadStream } from 'node:fs';

const rs = createReadStream('./file.txt', {});

rs.on('readable', () => {
	// Read data
	let data = rs.read();
	while (data !== null) {
		console.log('Read chunk:', data.toString());
		data = rs.read();
	}
});

rs.on('end', () => {
	console.log('No more data.');
});