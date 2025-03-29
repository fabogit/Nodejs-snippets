import { createReadStream, createWriteStream } from "node:fs";
import { Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';

const uppercase = new Transform({
	transform(chunk, encoding, callback) {
		// Data processing
		callback(null, chunk.toString().toUpperCase());
	},
});

// Since we’ll be awaiting pipeline(), we’ll need to wrap the pipeline() logic in an asynchronous function:
async function run() {
	await pipeline(
		createReadStream("./file.txt"),
		uppercase,
		createWriteStream("./newFile.txt")
	);
	console.log("Pipeline succeeded.");
}

run().catch((err) => {
	console.error("Pipeline failed.", err);
});