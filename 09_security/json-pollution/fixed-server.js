import { createServer, STATUS_CODES } from 'http';
import Ajv from 'ajv';

const ajv = new Ajv();

// Define the json schema
const schema = {
	title: 'Greeting',
	type: 'object',
	properties: {
		msg: { type: 'string' },
		name: { type: 'string' }
	},
	additionalProperties: false,
	required: ['msg']
};
const validate = ajv.compile(schema);

const greeting = (req, res) => {
	let data = '';
	req.on('data', (chunk) => (data += chunk));

	req.on('end', () => {
		try {
			data = JSON.parse(data);
		} catch (e) {
			res.end('');
			return;
		}
		// Validate req data on the schema
		if (!validate(data, schema)) {
			res.end('');
			return;
		}

		if (data.hasOwnProperty('name')) {
			res.end(`${data.msg} ${data.name}`);
		} else {
			res.end(data.msg);
		}
	});
};

const server = createServer((req, res) => {
	if (req.method === 'POST' && req.url === '/') {
		greeting(req, res);
		return;
	}

	res.statusCode = 404;
	res.end(STATUS_CODES[res.statusCode]);
});

server.listen(3000, () => {
	console.log('Server listening on port 3000');
});