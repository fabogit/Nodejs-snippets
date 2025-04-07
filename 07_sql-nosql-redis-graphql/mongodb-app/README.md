# Connecting and persisting to MongoDB

MongoDB is a NoSQL database management system built around a document-oriented model. Data
is stored in flexible, JSON-like documents called Binary JSON (BSON), which are organized into
collections, analogous to tables in relational databases. Each document within a collection can have
a different structure, allowing for dynamic schemas and easy modification of data models.
MongoDB supports powerful querying capabilities using its query language, which includes various
operators and methods for filtering, sorting, and manipulating data.
This recipe will use a book/author example using the MongoDB Node.js driver directly. We’ll write
functions to create and find authors and books within our MongoDB database. This script will illustrate
basic CRUD operations without the use of a web framework, focusing purely on database interactions.
Getting ready
To set up a MongoDB database with Docker and get your project directory ready for the application,
follow these steps:

As with the other databases in this chapter, we will be using Docker to provision a MongoDB
database using the MongoDB Docker image available at <https://hub.docker.com/_/mongo>:

```Bash
$ docker run --publish 27017:27017 --name node-mongo --detach mongo:8
```
