import { get } from 'node:http';

function httpGet(url) {
	return new Promise((resolve, reject) => {
		get(url, (res) => {
			let data = '';
			res.on('data', (chunk) => {
				data += chunk;
			});
			res.on('end', () => {
				resolve(data);
			});
		}).on('error', (err) => {
			reject(err);
		});
	});
}

const run = async () => {
	const res = await httpGet('http://example.com');
	console.log(res);
};

run();