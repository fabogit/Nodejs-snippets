# Connecting and persisting to a MySQL database

SQL is a standard for communicating with relational databases. Both MySQL (<https://www.mysql.com/>)
and PostgreSQL (<https://www.postgresql.org/>) are popular open source
**relational database management systems (RDBMSs)**. There are many implementations of SQL
databases, and each of them has its extensions and proprietary features. However, there is a base set
of commands for storing, updating, and querying data implemented across all these SQL databases.

In this recipe, we’re going to communicate with a MySQL database from Node.js using the `mysql2`
(<https://www.npmjs.com/package/mysql2>) module.

**Important note:**
We will use the `mysql2` package from `npm` for interacting with MySQL databases
in Node.js due to its compatibility with the latest MySQL features and its support for promises.
The choice of `mysql2` over the previously used `mysql` package is driven by it being more
up to date, allowing us to leverage newer features and capabilities such as the `Promise` and
`async`/`await` syntax.

In a terminal window, type the following command to start a MySQL database listening on port `3306`:

```Bash
$ docker run --publish 3306:3306 --name node-mysql --env MYSQL_ROOT_PASSWORD=PASSWORD --detach mysql:8
```

**Important note:**
The `--publish 3306:3306` option in a Docker command maps port `3306` on the host
machine to port `3306` on the Docker container, allowing external access to the container’s
service running on that port.

Test the connection running:

```Bash
$ node setupDb.mjs
Connected as id 18
Database created or already exists.
Tasks table created or already exists.
```

And run the program with the following command:

```Bash
$ node tasks.mjs "Walk the dog."
Connected as id 10
[ { id: 1, task: 'Walk the dog.', completed: 0 } ]
```

## How it works…

The `createConnection()` method exposed from the `mysql2` module establishes a connection
to the MySQL server based on the configuration and credentials passed to the method. In the recipe,
we passed the `createConnection()` method the username and password for our database
using environment variables. The `mysql2` module defaults to looking for a MySQL database at
`localhost:3306`, which is where the MySQL Docker container that we created was exposed.
The `mysql2` module from `npm` aims to provide equivalent
functionality to the preceding `mysql` module from `npm`. A complete list of options that can be passed
to the `createConnection()` method is available in the `mysql` module API documentation
at <https://github.com/mysqljs/mysql#connection-options>.

**Important note:**
Connection pools can also be utilized to minimize the time needed to connect to the MySQL
server by reusing existing connections instead of closing them after use. This approach enhances
query latency by eliminating the overhead associated with setting up new connections. Such
a strategy is crucial for the development of large-scale applications. For more details, consult
the API documentation at <https://sidorares.github.io/node-mysql2/docs#using-connection-pools>.

Throughout the recipe, we used the `query()` method to send SQL statements to the MySQL database.
The SQL statements in the `setupDb.mjs` file created a `tasks` database and a `tasks` table. The
`task.mjs` file included SQL to insert a single task into the `tasks` table. The final SQL statement
we sent to the database using the `query()` method was a `SELECT` statement, which returned the
contents of the `tasks` table.

Each of the SQL statements is queued and executed asynchronously. It is possible to pass a callback
function as a parameter to the `query()` method, but we instead leverage the `async`/`await` syntax.

The `end()` method, as the name suggests, ends the connection to the database. The `end()` method
ensures that there are no queries still queued or processing before ending the connection. There’s
another method, `destroy()`, that will immediately terminate the connection to the database,
ignoring the state of any pending or executing queries.

One of the common types of attacks on user-facing web applications that it is necessary to be aware
of is SQL injection attacks.

A SQL injection is where an attacker sends malicious SQL statements to your database. This is often
achieved by inserting the malicious SQL statement into a web page input field. This is not a Node.
js-specific problem; it also applies to other programming languages where the SQL query is created
through string concatenation. The way to mitigate against any of these attacks is to sanitize or escape
user input such that our SQL statements cannot be maliciously manipulated.

You can manually escape user-supplied data directly by using `connection.escape()`. In the
recipe, however, we used the placeholder `(?)` syntax in our SQL query to achieve the same:

```JavaScript
await connection.query(
          `INSERT INTO tasks.tasks (task) VALUES (?);`,
          [process.argv[2]]
      );
```

The `mysql2` module handles the sanitizing of user input for us if we pass our input values to the
query via the second parameter of the query function. Multiple placeholders `(?)` are mapped to
values in the SQL query in the order they are supplied.
