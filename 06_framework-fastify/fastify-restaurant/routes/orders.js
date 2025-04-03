/**
 * @type {import('fastify').FastifyPluginCallback}
 */
async function ordersPlugin(app, opts) {
	const orderJsonSchema = {
		type: 'object',
		required: ['table', 'dishes'],
		properties: {
			table: { type: 'number', minimum: 1 },
			dishes: {
				type: 'array',
				minItems: 1,
				items: {
					type: 'object',
					required: ['id', 'quantity'],
					properties: {
						id: { type: 'string', minLength: 24, maxLength: 24 },
						quantity: { type: 'number', minimum: 1 }
					}
				}
			}
		}
	};

	app.post('/orders', {
		schema: {
			body: orderJsonSchema
		},
		preHandler: async function validateDishes(request, reply) {
			// Here for example we can validate the request _id

			// const dishIds = request.body.dishes.map(dish => dish.id);
			// try {
			// Query the database for dishes with the provided IDs
			// Check if the number of existing dishes matches the number of requested dishes
			// } catch (error) {
			// console.error('Error validating dish IDs:', error);
			// return reply.code(500).send({ message: 'Internal server error while validating dishes' });

		},
		handler: async function createOrder(request, reply) {
			const order = {
				status: 'pending',
				createdAt: new Date(),
				items: request.body.dishes
			};

			const orderId = await this.source.insertOrder(order);
			reply.code(201);
			return { id: orderId };
		}
	});

	const orderListSchema = {
		type: 'array',
		items: {
			type: 'object',
			properties: {
				id: { type: 'string' },
				createdAt: { type: 'string', format: 'date-time' },
				items: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							name: { type: 'string' },
							order: { type: 'number' },
							quantity: { type: 'number' }
						}
					}
				}
			}
		}
	};

	app.get('/orders', {
		schema: {
			response: {
				200: orderListSchema
			}
		},
		handler: async function readOrders(request, reply) {
			const orders = await this.source.readOrders({ status: 'pending' });

			const recipesIds = orders.flatMap(order => order.items.map(item => item.id));
			const recipes = await this.source.readRecipes({ id: { $in: recipesIds } });

			return orders.map(order => {
				order.items = order.items
					.map(item => {
						const recipe = recipes.find(recipe => recipe.id === item.id);
						return recipe ? { ...recipe, quantity: item.quantity } : undefined;
					})
					.filter(recipe => recipe !== undefined);
				return order;
			});
		}
	});

	app.patch('/orders/:orderId', {
		config: { auth: true },
		schema: {
			params: {
				type: 'object',
				required: ['orderId'],
				properties: {
					orderId: { type: 'string', minLength: 24, maxLength: 24 }
				}
			}
		},
		handler: async function markOrderAsDone(request, reply) {
			const orderId = request.params.orderId;
			const modifiedCount = await this.source.markOrderAsDone(orderId);
			if (modifiedCount === 0) {
				reply.code(404);
				throw new Error('Order not found');
			}

			reply.code(204);
		}
	});
}

export default ordersPlugin;
