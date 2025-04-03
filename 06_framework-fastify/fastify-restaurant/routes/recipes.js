/**
 * @type {import('fastify').FastifyPluginCallback}
 */
function recipesPlugin(app, opts, next) {
	// app.addHook('onRequest', async function isChef(request, reply) {
	// 	if (request.headers['x-api-key'] !== 'fastify-rocks') {
	// 		reply.code(401);
	// 		throw new Error('Invalid API key');
	// 	}
	// });

	app.route({
		method: 'GET',
		url: '/menu',
		handler: menuHandler
	});

	app.get('/recipes', { handler: menuHandler });

	const jsonSchemaBody = {
		type: 'object',
		required: ['name', 'country', 'order', 'price'],
		properties: {
			name: { type: 'string', minLength: 3, maxLength: 50 },
			country: { type: 'string', enum: ['ITA', 'IND'] },
			description: { type: 'string' },
			order: { type: 'number', minimum: 0, maximum: 100 },
			price: { type: 'number', minimum: 0, maximum: 50 }
		}
	};

	app.post('/recipes', {
		config: { auth: true },
		schema: {
			body: jsonSchemaBody
		},
		handler: async function addToMenu(request, reply) {
			const { name, country, description, order, price } = request.body;
			const newPlateId = await app.source.insertRecipe({
				name,
				country,
				description,
				order,
				price,
				createdAt: new Date()
			});

			reply.code(201);
			return { id: newPlateId };
		}
	});

	app.delete('/recipes/:id', {
		config: { auth: true },
		schema: {
			params: {
				type: 'object',
				properties: {
					id: { type: 'string', minLength: 24, maxLength: 24 }
				}
			}
		},
		handler: async function removeFromMenu(request, reply) {
			const { id } = request.params;
			const [recipe] = await app.source.readRecipes({ id });
			if (!recipe) {
				reply.code(404);
				throw new Error('Not found');
			}
			await app.source.deleteRecipe(id);
			reply.code(204);
		}
	});

	/**
	* This is only another style with which to define plugins, and it is the most
	* performant choice when we don’t need async operations during plugin loading.
	* Moreover, it is important to remember that it must be the last operation to execute,
	* and after calling it, it is not possible to add more routes.
	*/
	next();
}

/**
 *
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function menuHandler(request, reply) {
	const recipes = await this.source.readRecipes();
	return recipes;
}

export default recipesPlugin;
