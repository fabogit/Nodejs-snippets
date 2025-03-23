import { readFile, writeFile } from 'node:fs';
import { join } from 'node:path';

const filepath = join(process.cwd(), 'hello.txt');

readFile(filepath, 'utf8', (err, contents) => {
	if (err) {
		return console.log(err);
	}
	console.log('File Contents:', contents);
	const upperContents = contents.toUpperCase();
	setTimeout(() => updateFile(filepath, upperContents), 10);
});

function updateFile(filepath, contents) {
	writeFile(filepath, contents, function (err) {
		if (err) throw err;
		console.log('File updated.');
	});
}

setInterval(() => process.stdout.write('**** \n'), 1).unref();