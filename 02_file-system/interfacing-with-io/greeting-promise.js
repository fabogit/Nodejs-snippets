import { createInterface } from 'node:readline/promises';

async function greet() {
	const rl = createInterface({
		input: process.stdin,
		output: process.stdout
	});
	const name = await rl.question('What is your name?\n');
	console.log(`Hello ${name}!`);
	rl.close();
}

greet();