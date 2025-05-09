# Interacting with the File System

Before Node.js, JavaScript was predominantly used in the browser. Node.js brought JavaScript to the
server and enabled us to interact with the operating system through JavaScript. Today, Node.js is one
of the most popular technologies for building server-side applications.

Node.js interacts with the operating system at a fundamental level: **input and output (I/O)**. This
chapter will explore the core APIs provided by Node.js that allow us to interact with standard I/O,
the file system, and the network stack.

Here we will show you how to read and write files both synchronously and asynchronously.
Node.js was built to handle asynchronous code and enable a non-blocking model. Understanding
how to read and write asynchronous code is fundamental learning, and it will show how to leverage
the capabilities of Node.js.

We will also learn about the core modules provided by Node.js. We’ll be focusing on the **File System**
module, which enables you to interact with the file system and files. Newer versions of Node.js have
added `Promise` variants of many file system APIs, which will also be touched upon here.

Here we will cover the following recipes:

- Interacting with the file system

- Working with files

- Fetching metadata

- Watching files
