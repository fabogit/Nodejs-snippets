import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
const filepath = join(process.cwd(), 'hello.txt');

async function run() {
	try {
		const contents = await readFile(filepath, 'utf8');
		console.log('File Contents:', contents);
	} catch (error) {
		console.error(error);
	}
}

run();