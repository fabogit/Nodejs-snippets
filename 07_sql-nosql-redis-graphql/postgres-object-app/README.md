# Connecting and persisting to a PostgreSQL database

PostgreSQL, first introduced in 1996, is a powerful open source object-relational database system
that has stood the test of time due to its reliability, feature robustness, and performance. One of
PostgreSQL’s standout features is its ability to be utilized as both a traditional relational database, where
data is stored in tables with relationships among them, and as a document database, such as NoSQL
databases, where data can be stored in JSON format. This flexibility allows developers to choose the
most appropriate data storage model based on their application’s requirements.
Throughout this tutorial, we will explore the basics of interacting with a PostgreSQL database from
a Node.js application. We’ll use the pg module, a popular and comprehensive PostgreSQL client for
Node.js. The pg module simplifies connecting to and executing queries against a PostgreSQL database.

To get started, we will need a PostgreSQL server to connect to. We will use Docker to provision a
containerized PostgreSQL database. Refer to the Technical requirements section of this chapter for
more information about using Docker to provision databases.
We will be using the Docker official PostgreSQL image from https://hub.docker.com/_/postgres.

In a terminal window, type the following to provision a postgres container:

```Bash
$ docker run --publish 5432:5432 --name node-postgres-latest --env POSTGRES_PASSWORD=PASSWORD --detach postgres:17
```

Run `tasks.js`, passing a task as a command-line argument. The task will be inserted into
the database and listed out before the program ends:

```Bash
$ node tasks.js "Bath the dog."
[
  { id: 1, task: 'Bath the dog.' }
]
```

We can also run the program without passing a task. When we run `tasks.js` with no `task`
parameter, the program will output the tasks stored in the database.

We provisioned a containerized PostgreSQL database using
the Docker official image from Docker Hub. The provisioned PostgreSQL database was provisioned
in a Docker container named `node-postgres`. By default, the PostgreSQL Docker image creates
a user and database named `postgres`. The Docker command we used to provision the database
instructed the container to make the PostgreSQL database available at `localhost:5432` with a
placeholder password of `PASSWORD`.

The configuration information required for a connection to our PostgreSQL database was specified in
the `.env` file. We used the `dotenv` module to load this configuration information as environment
variables to our Node.js process.

Notice that we didn’t have to directly pass any of the environment variables to the client. This is
because the `pg` module automatically looks for specifically named variables (`PGHOST`, `PGPORT`, and
`PGUSER`). However, if we wanted, we could specify the values when we create the client, as follows:

```JavaScript
const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres'
});
```

We use the `connect()` method to connect to our PostgreSQL database. We provide this method
with a callback function to be executed once the connection attempt is complete. We added error
handling within our callback function so that if the connection attempt fails, then an error is thrown.

Throughout the remainder of the program, we use the `query()` method provided by the `pg` module
to execute SQL queries against the PostgreSQL database. Each of our calls to the `query()` method
is supplied with a callback function to be executed upon completion of the query.

## Object data (postgres-object-app)

As well as storing traditional relational data, PostgreSQL also provides the ability to store object data.
This enables the storing of relational data alongside document storage.

Now, when we run our application, we can pass it JSON input to represent the task. Note that
we will need to wrap the JSON input in single quotes, and then use double quotes for the
key-value pairs:

```Bash
$ node tasks.js '{"task":"Walk the dog."}'
[ { id: 1, doc: { task: 'Walk the dog.' } } ]
```

The `doc` field was created with the `jsonb` type, which represents the JSON binary type.
PostgreSQL provides two JSON data types: `json` and `jsonb`. The `json` data type is like a
regular text input field but with the addition that it validates the JSON. The `jsonb` type is
structured and facilitates queries and indexes within the document objects. You’d opt for the
`jsonb` data type over the `json` data type when you require the ability to query or index the data.

Based on this example, a `jsonb` query would look as follows:

```SQL
SELECT *
FROM task_docs
WHERE doc ->> task= "Bath the dog."
```

Note that we’re able to query against the `task` property within the document object. For more
information about the `jsonb` data type, refer to the official PostgreSQL documentation at
<https://www.postgresql.org/docs/9.4/datatype-json.html>.
