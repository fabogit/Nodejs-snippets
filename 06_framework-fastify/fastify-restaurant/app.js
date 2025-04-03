import datasource from './plugins/datasource.js';
import authPlugin from './plugins/auth.js';
import config from './plugins/config.js';

import recipesPlugin from './routes/recipes.js';
import ordersPlugin from './routes/orders.js';

/**
 * @type {import('fastify').FastifyHttpOptions<http.Server, FastifyBaseLogger>}
 */
const serverOptions = {
	logger: true,
	ajv: {
		customOptions: {
			allErrors: true,
			removeAdditional: 'all'
		}
	}
};

/**
 * @type {import('fastify').FastifyPluginCallback}
 */
async function appPlugin(fastify, opts) {

	fastify.addHook('onReady', async function hook() {
		this.log.info(`onReady runs from file ${import.meta.url}`);
	});

	fastify.addHook('onClose', async function hook(app) {
		app.log.info(`onClose runs from file ${import.meta.url}`);
	});


	fastify.get('/', async function homeHandler() {
		return {
			api: 'fastify-restaurant-api',
			version: 1
		};
	});

	await fastify.register(config, opts);
	fastify.register(datasource, { databaseUrl: fastify.appConfig.DATABASE_URL });
	fastify.register(authPlugin, { tokenValue: fastify.appConfig.API_KEY });
	fastify.register(recipesPlugin);
	fastify.register(ordersPlugin);
}

export default appPlugin;
export { serverOptions as options };