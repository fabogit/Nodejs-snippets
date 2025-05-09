# Working with Streams

Streams are one of the key features of Node.js. Most Node.js applications rely on the underlying Node.
js streams implementation, be it for reading/writing files, handling HTTP requests, or other network
communications. Streams provide a mechanism to read input and write output sequentially.

By reading chunks of data sequentially, we can work with very large files (or other data input) that
would generally be too large to read into memory and process as a whole. Streams are fundamental
to big data applications or media streaming services, where the data is too large to consume at once.

There are four main types of streams in Node.js:

- `Readable streams`: Used for reading data, such as reading a file, or reading data from a request.

- `Writable streams`: Used for writing data, such as writing a file, or sending data to a response.

- `Duplex streams`: Used for both reading and writing data, such as a TCP socket.

- `Transform streams`: A type of duplex stream that transforms the data input, and then outputs
  the transformed data. A common example would be a compression stream.

Here we will demonstrate how we can create these various types of streams, as well as how we can
chain these types of streams together to form stream pipelines.

Here we will cover the following recipes:

- Creating readable and writable streams

- Interacting with paused streams

- Piping streams

- Creating transform streams

- Building stream pipelines

**Important note:**
The recipes here will focus on the streams implementations provided by the Node.js
core `stream` module in Node.js 22. Because of this, we will not use the `readable-stream`
module (https://github.com/nodejs/readable-stream). The `readable-stream`
module aims to mitigate any inconsistencies in the streams implementations across Node.js
versions by providing an external mirror of the streams implementations as an independently
installable module. At the time of writing, the latest major version of `readable-stream` is
version 4, which aligns with the Node.js 18 streams implementations.
