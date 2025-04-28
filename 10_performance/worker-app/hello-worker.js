const {
	Worker,
	isMainThread,
	parentPort,
	workerData
} = require('worker_threads');

if (isMainThread) {
	// Main thread code
	const worker = new Worker(__filename, {
		workerData: 'User'
	});

	worker.on('message', (msg) => {
		console.log(msg);
	});
} else {
	// Worker code
	const greeting = `Hello ${workerData}!`;
	// Using the parentPort.postMessage() method will return the value to our main thread.
	parentPort.postMessage(greeting);
}