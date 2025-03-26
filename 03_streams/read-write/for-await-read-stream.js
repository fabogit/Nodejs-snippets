import { createReadStream } from 'node:fs';

const rs = createReadStream('./file.txt');
async function run() {
	for await (const chunk of rs) {
		console.log('Read chunk:', chunk.toString());
	}
	console.log('No more data.');
}

run();