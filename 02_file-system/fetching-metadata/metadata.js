import { statSync } from 'node:fs';
const file = process.argv[2];

function printMetadata(file) {
	try {
		const fileStats = statSync(file);
		console.log(fileStats);
	} catch (err) {
		console.error('Error reading file path:', file);
	}
}

printMetadata(file);