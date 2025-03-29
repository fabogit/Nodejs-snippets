import { createServer, STATUS_CODES } from 'http';
import { readFileSync } from 'fs';
import { join } from 'path';

const form = readFileSync(join(__dirname, 'public', 'json-form.html'));

createServer((req, res) => {
	if (req.method === 'GET') {
		get(res); return;
	}

	if (req.method === 'POST') {
		post(req, res);
		return;
	}
	error(405, res);
})
	.listen(3000);

function get(res) {
	res.writeHead(200, {
		'Content-Type': 'text/html'
	});
	res.end(form);
}

function post(req, res) {
	if (req.headers['content-type'] !== 'application/json') {
		error(415, res);
		return;
	}
	let input = '';
	req.on('data', (chunk) => { input += chunk.toString(); });

	req.on('end', () => {
		const parsed = JSON.parse(input);
		if (parsed.err) {
			error(400, 'Bad Request', res); return;
		}
		console.log('Received data: ', parsed);
		res.end('{"data": ' + input + '}');
	});
}

function error(code, res) {
	res.statusCode = code;
	res.end(STATUS_CODES[code]);
}