import { watchFile } from 'node:fs';
import { join } from 'node:path';

const file = join(process.cwd(), 'file.txt');

watchFile(file, (current, previous) => {
	const formattedTime = new Intl.DateTimeFormat('en-GB', {
		dateStyle: 'full',
		timeStyle: 'long'
	}).format(current.mtime);
	return console.log(`${file} updated ${formattedTime}`);
});