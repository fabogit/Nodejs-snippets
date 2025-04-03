import fp from 'fastify-plugin';

/**
 * @type {import('fastify').FastifyPluginCallback}
 */
async function authPlugin(app, opts) {
	app.decorateRequest('isChef', function () {
		return this.headers['x-api-key'] === opts.tokenValue;
	});

	app.decorate(
		'authOnlyChef',
		/**
		 * @param {import('fastify').FastifyRequest} request
		 * @param {import('fastify').FastifyReply} reply
		 */
		async function (request, reply) {
			if (!request.isChef()) {
				reply.code(401);
				throw new Error('Invalid API key');
			}
		});

	app.addHook('onRoute', function hook(routeOptions) {
		if (routeOptions.config?.auth) {
			routeOptions.onRequest = [app.authOnlyChef].concat(routeOptions.onRequest || []);
		}
	});
}

export default fp(authPlugin, {});