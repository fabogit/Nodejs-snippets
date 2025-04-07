# Connecting and persisting to MongoDB

MongoDB is a NoSQL database management system built around a document-oriented model. Data
is stored in flexible, JSON-like documents called **Binary JSON (BSON)**, which are organized into
**collections**, analogous to tables in relational databases. Each document within a collection can have
a different structure, allowing for dynamic schemas and easy modification of data models.

MongoDB supports powerful querying capabilities using its query language, which includes various
operators and methods for filtering, sorting, and manipulating data.

This recipe will use a book/author example using the MongoDB Node.js driver directly. We’ll write
functions to create and find authors and books within our MongoDB database. This script will illustrate
basic CRUD operations without the use of a web framework, focusing purely on database interactions.
Getting ready
To set up a MongoDB database with Docker and get your project directory ready for the application,
follow these steps:

We will be using Docker to provision a MongoDB database using the MongoDB Docker image available at <https://hub.docker.com/_/mongo>:

```Bash
$ docker run --publish 27017:27017 --name node-mongo --detach mongo:8
```

Run the script:

```Bash
$ node index.js
```

## How it works

We begin by importing the necessary modules, notably the `MongoClient` class from
`npm`’s `mongodb` module. Setting up the MongoDB connection involves defining a URI to connect
to the local MongoDB server and initializing a `MongoClient` instance with this URI. In our
case, our database was hosted on the typical default host and port for MongoDB: `mongodb://localhost:27017`.

Note that MongoDB does not enable authentication by default when using Docker, so no authentication
parameters were needed in the connection string.

The `connectToMongoDB()` function asynchronously attempts to establish a connection to the
MongoDB server, logging success or failure messages accordingly and returning a reference to the
specified database if successful.

The `mongodb` module from `npm` exposes a vast range of CRUD methods to interact with the MongoDB
collections in your MongoDB database. The term _CRUD_ is used to represent the basic functions for
persistent storage. In this recipe, we used the `find()` and `insertOne()` CRUD methods. A full
list of available methods is defined in the Node.js MongoDB driver API documentation
(<https://mongodb.github.io/node-mongodb-native/6.5/>).

We also used the `aggregate()` method in the `findAllBooksWithAuthors()` function.
An aggregation pipeline can contain one or more stages to create a flow of operations that processes,
transforms, and returns results.

The `main()` function orchestrates the execution flow, starting with connecting to the MongoDB database.
Upon successful connection, it proceeds to create an author document for `Richard Adams` and a
corresponding book document titled `Watership Down`, associating them together. Subsequently, it
retrieves all authors and books with their associated author details using the defined functions. Error
handling is implemented throughout the script using `try/catch` blocks to handle any potential errors
that may arise during execution. Finally, the script concludes by closing the MongoDB client connection.

Overall, this script serves as a practical example of how to utilize Node.js and the `mongodb` package
to perform CRUD operations on a MongoDB database, demonstrating basic functionalities such as
connecting to the database, inserting documents, querying collections, and handling errors effectively.
