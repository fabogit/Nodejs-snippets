# Using Web Protocols

Node.js was built with web servers in mind. Using Node.js, we can quickly create a web server with
a few lines of code, allowing us to customize the behavior of our server.

**HTTP** stands for **HyperText Transfer Protocol** and is an application layer protocol that underpins
the **_World Wide Web (WWW)_**. HTTP is a stateless protocol that was originally designed to facilitate
communication between web browsers and servers. The recipes here will have a large emphasis
on how to handle and send HTTP requests. Although the recipes do not require a deep understanding
of how HTTP operates, it would be worthwhile reading a high-level overview if you’re completely
new to the concept. MDN Web Docs provides an overview of HTTP at
<https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview>.

Here we will showcase the low-level core **application programming interfaces (APIs)** that
Node.js provides for interacting with web protocols. We’ll start by making HTTP requests, creating
an HTTP server, and learning how to handle `POST` requests and file uploads.
Later we will learn how to create a WebSocket server and how to create a
**Simple Mail Transfer Protocol (SMTP)** server using Node.js.

It’s important to understand how Node.js interacts with underlying web protocols, as these web
protocols and fundamental concepts form the basis of most real-world web applications. Later, in
_Part 6_, we will learn how to use web frameworks that abstract web protocols into higher-level APIs,
but understanding how Node.js interacts with web protocols at a low level is important.

Here we will cover the following recipes:

- Making HTTP requests

- Creating an HTTP server

- Receiving HTTP POST requests

- Handling file uploads

- Creating a WebSocket server

- Creating an SMTP server
