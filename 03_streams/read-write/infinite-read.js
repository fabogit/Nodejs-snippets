import { createReadStream } from 'node:fs';

// The /dev/urandom file is a pseudo-random number generator,
//  which is available on Unix-like operating systems.
const rs = createReadStream('/dev/urandom', {});

let size = 0;
rs.on('data', (data) => {
	size += data.length;
	console.log('File size:', size);
});