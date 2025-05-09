# Persisting to Databases

In the world of application development, being able to save and retrieve data is essential. Imagine
you’re building a game where you need to keep scores or a social media application where users need
to save their profiles and posts. A lot of the time, a traditional relational database is what you need
for this. It’s like an organized filing system where everything has its place in neat tables, and these
tables can relate to each other in specific ways. For instance, one table might store information about
books while another stores information about authors, and links between the two can show which
author wrote which book.

But what if your data doesn’t fit into this structured format? What if you’re dealing with something
more flexible or unpredictable, such as posts on a social media feed where some posts have images,
some have videos, and others have just text? This is where non-relational, or NoSQL, databases come
in. They’re designed to handle a wide variety of data structures, from simple key-value pairs to more
complex documents or graphs. This makes them a great choice for modern applications that require
flexibility and scalability.

**Important note:**
Here we will focus on interacting with these databases in Node.js. As such, some elementary
knowledge of databases and Structured Query Language (SQL) is assumed.

We’ll start with setting up a simple SQL database to understand the fundamentals of database
operations. Then, we’ll explore the dynamic world of NoSQL databases, learning how to interact with
them to handle more flexible data structures. By the end we’ll have a foundation in
using diverse types of databases in Node.js applications, giving the flexibility to choose the
right storage solution for any project.

Here we will cover the following recipes:

- Connecting and persisting to a MySQL database

- Connecting and persisting to a PostgreSQL database

- Connecting and persisting to MongoDB

- Persisting data with Redis

- Exploring GraphQL
