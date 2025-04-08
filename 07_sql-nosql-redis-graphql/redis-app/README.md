# Persisting data with Redis

Redis is an open source in-memory key-value data store. Used in the correct setting, Redis can be a fast-
performing data store. It is often used to provide caching in applications but can also be used as a database.

Redis, an acronym for **Remote Dictionary Server**, is an in-memory data structure store, often used
as a database, cache, and message broker. It excels in scenarios requiring high speed and efficiency,
such as caching, session management, real-time analytics, and message queuing. Redis’s ability to
support various data structures, combined with its atomic operations and **publish/subscribe (pub/sub)**
messaging capabilities, makes it a powerful tool for enhancing the performance and scalability of
Node.js applications. Its in-memory nature ensures rapid access to data, significantly reducing latency
compared to traditional disk-based databases, making it ideal for applications where speed is critical.

In the context of Node.js, Redis is particularly valuable for managing session data in web applications,
enabling quick data retrieval, and improving user experience. It’s also widely used for implementing
caching mechanisms, reducing the load on databases, and speeding up response times. Moreover, its
pub/sub messaging system facilitates the development of real-time applications, such as chat applications
or live notifications, by allowing efficient communication between clients and servers. Whether you’re
looking to optimize your application’s performance, scale efficiently, or build feature-rich real-time
interactions, integrating Redis with Node.js offers a robust solution to meet these needs.

We will use Docker to provision a Redis database,
based on the Docker image available at <https://hub.docker.com/_/redis>. Run the
following command:

```Bash
$ docker run --publish 6379:6379 --name node-redis --detach redis:7
```

We can run the program with a task passed as command-line input. The task will be stored
in Redis and subsequently printed via the listTasks() function:

```Bash
$ node tasks.mjs "Walk the dog."
{ task: 'Walk the dog.' }
```

We’ve now persisted data in our Redis data store using the redis module.

## How it works

The `createClient()` method initializes a new client connection. This method will default to
configuration for a Redis instance at `localhost:6379`, where `6379` is the conventional port
for Redis. In previous versions of the `redis` module from `npm`, the `createClient()` method
would automatically connect to the server. However, it’s now necessary to explicitly call
`client.connect()` to establish a connection.

Within our `addTask()` function, we generate a random string, or hash, to append to our task key.
This ensures that each task key is unique, while still having a specifier indicating that it is a task to aid
debugging. This is a common convention when using Redis.

The `hSet()` method sets the key and value in Redis; this is what stores our task in Redis. If we
supplied a key that already existed, this method would overwrite the contents.

**Important note:**
The legacy `hmset()` method is considered deprecated in newer versions of Redis. `The hSet()`
method used in the recipe should be used for setting hash values.

In the `listTasks()` function, we use the `keys()` method to search for all keys stored in our Redis
data store that match the `Tasks:\*` wildcard. We’re leveraging the `keys()` method to list all tasks we
have stored in Redis. Note that the `keys()` method in real applications should be used with caution.
This is because, in applications with many keys, searching could have negative performance implications.
Once we have all our task keys, we use the `hGetAll()` method to return the value at each key. Once
obtained, we print this value to `STDOUT` using `console.log()`.

The `redis` module `npm` provides a one-to-one mapping of all available Redis commands. Refer to
<https://redis.io/commands> for a complete list of Redis commands.

## Authenticating with Redis

To connect to a Redis client that requires authentication, we can supply the credentials via the
`createClient()` method.

We can, again, use Docker to create a password-protected Redis instance. This Redis container
will be available at `localhost:6380`:

```Bash
$ docker run --publish 6380:6379 --name node-redis-pw --detach redis:7 redis-server --requirepass PASSWORD
```

As before, we can run the program with a task passed as command-line input:

```Bash
$ node tasks-auth.mjs "Wash the car."
{ task: 'Wash the car.' }
```

Note that as we’re pointing to a different Redis instance, it will not contain the tasks we added in the
main recipe.

## Transactions with Redis

The redis module exposes a method named `multi()` that can be used to create a **transaction**. A
transaction is a series of commands that are queued and then executed as a single unit.

For example, we could use the following to update a task as a transaction by executing a `get()`,
`set()`, `get()` sequence:

```JavaScript
import { createClient } from 'redis';

const client = createClient();
client.on('error', (err) => {
  console.log('Error:', err);
});

await client.connect();
await client.set('Task:3', 'Write letter.');

const resultsArray = await client
  .multi()
  .get('Task:3')
  .set('Task:3', 'Mail letter.')
  .get('Task:3')
  .exec();

console.log(resultsArray);
// ['Write letter.', 'OK', 'Mail letter.']
client.quit();
```

Each of the tasks is queued until the `exec()` method is executed. If any command fails to be queued,
none of the commands in the batch are executed. During the `exec()` method, all commands are
executed in order.
