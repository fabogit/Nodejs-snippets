# Piping streams

Run `node pipe-stream.js`

A pipe is a form of one-way redirection. In our terminal (DOS or Unix-like), we often utilize the pipe
operator (|) to pipe the output of one program as the input to another program. For example, we
can enter `$ ls | head -3` to pipe the output of the `ls` command to the `head -3` command,
resulting in the first three files in our directory being returned.

Like how we can use the pipe operator in our shells to pipe output between programs, we can use the
Node.js `pipe()` method to pipe data between streams.

In this recipe, we created a readable stream to read our `file.txt` file using the `createReadStream()`
method. Then, we piped the output of this readable stream to `process.stdout` (a writable stream)
using the `pipe()` method. The `pipe()` method attaches a data event handler to the source stream,
which writes the incoming data to the destination stream.

The `pipe()` method is used to direct data through a flow of streams. Under the hood, the pipe()
method manages the flow of data to ensure that the destination writable stream is not overwhelmed
by a faster readable stream.

The in-built management provided by the `pipe()` method helps resolve the issue of backpressure.
Backpressure occurs when an input overwhelms a system’s capacity. For streams, this could occur
when we’re consuming a stream that is rapidly reading data, and the writable stream can’t keep up.
This can result in a large amount of memory being kept in a process before being written by the
writable stream. The mass amount of data being stored in memory can degrade our Node.js process
performance, or in the worst cases, cause the process to crash.

By default, when using the `pipe()` method, `stream.end()` is called on the destination writable
stream when the source readable stream emits an `end` event. This means that the destination is no
longer writable.
To disable this default behavior, we can supply `{ end: false }` to the `pipe()` method via an
`options` argument:

`sourceStream.pipe(destinationStream, {end: false});`

This configuration instructs the destination stream to remain open even after the `end` event has been
emitted by the source stream.

**Chaining:**

Stream chaining in Node.js allows for efficient data processing by linking together multiple streams.
This method enables data transformations with minimal memory overhead, which is ideal for
operations such as compression. In the following example, we’ll demonstrate the process of reading
a file, compressing its contents, and writing the compressed data to a new file to highlight the use of `pipe()` for chaining streams:

```JavaSript
const fs = require('node:fs');
const zlib = require('node:zlib');
const readStream = fs.createReadStream('input.txt');
const writeStream = fs.createWriteStream('output.txt.gz');
// Chain the streams: read -> compress -> write
readStream.pipe(zlib.createGzip()).pipe(writeStream);
```

In this example, `readStream.pipe(zlib.createGzip()).pipe(writeStream);` reads
data from `input.txt`, compresses it on-the-fly, and writes the compressed data to `output.txt.gz`. This chain of operations is executed with efficiency, showcasing the elegance and power of stream
chaining in Node.js for data processing tasks.

In the example provided, error handling is not explicitly shown, but it’s crucial in a real-world
application. In Node.js, when chaining streams, errors can be propagated through the chain. When
using `pipe()`, errors should be listened for on each stream by attaching an `error` event listener to
each stream involved. This ensures that errors are caught and managed where they occur.
