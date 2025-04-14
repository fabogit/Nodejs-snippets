const users = [
	{
		username: 'iamroot',
		password: 'badpassword'
	}
];

/**
 * @type {import('fastify').FastifyPluginCallback}
 */
async function routes(fastify, options) {
	fastify.get('/login', async (request, reply) => {
		return reply.view('login.ejs', { isAuth: true });
	});

	fastify.post('/login', async (request, reply) => {
		const { username, password } = request.body;

		const user = users.find((u) => u.username === username);

		// For demo purposes, use plain text password comparison
		if (user && password === user.password) {
			request.session.user = { username: user.username };
			await request.session.save();
			return reply.view('index.ejs', { user: request.session.user });
		} else {
			return reply.view('login.ejs', { isAuth: false });
		}
	});

	fastify.get('/logout', async (request, reply) => {
		request.session.destroy((err) => {
			if (err) {
				return reply.send(err);
			} else {
				return reply.redirect('/');
			}
		});
	});
}

module.exports = routes;