# Creating transform streams

Run `node transform-stream.js`

Transform streams allow us to consume input data, process that data, and then output the data in
its processed form. We can use transform streams to handle data manipulation functionally and
asynchronously. It’s possible to pipe many transform streams together, allowing us to break complex
processing down into sequential tasks.

**Important note:**
The `through2` module (<https://www.npmjs.com/package/through2>) is very
popular and provides a wrapper for creating Node.js transform streams. However, over the
past few years, there have been many simplifications and improvements to the Node.js core
stream implementation. Today, the Node.js stream API provides simplified construction, as
demonstrated in this recipe, which means we can achieve equivalent syntax using Node.js core
directly, without the need for `through2`.

Transform streams are duplex streams, which means they implement both readable and writable stream
interfaces. Transform streams are used to process (or transform) the input and then pass it as output.

To create a transform stream, we must import the `Transform` class from the Node.js core stream
module. The transform stream constructor accepts the following two arguments:

- `transform`: The function that implements the data processing/transformation logic.

- `flush`: If the transform process emits additional data, the `flush` method is used to flush the
  data. This argument is optional.

It is the `transform()` function that processes the stream input and produces the output. Note that it is not necessary for the number of chunks that are supplied via the input stream to be equal to the number output by the transform stream – some chunks could be omitted during the transformation/processing.

Under the hood, the `transform()` function gets attached to the `_transform()` method of the
transform stream. The `_transform()` method is an internal method on the `Transform` class
that is not intended to be called directly (hence the underscore prefix).

The `_transform()` method accepts the following three arguments:

- `chunk`: The data to be transformed.

- `encoding`: If the input is of the `String` type, the encoding will be of the `String` type. If
  it is of the `Buffer` type, this value is set to `buffer`.

- `callback(err, transformedChunk)`: The callback function to be called once the
  chunk has been processed. The callback function is expected to have two arguments – the first
  an error and the second the transformed chunk.

In this recipe, our `transform()` function called the `callback()` function with our processed
data (where our processed data was `chunk.toString().toUpperCase()` to convert the input
into an uppercase string).

**Important note:**
Node.js comes with some built-in transform streams. Both the Node.js core crypto and zlib
modules expose transform streams. As an example, the `zlib.createGzip()` method is
a transform stream that’s exposed by the `zlib` module that compresses the file that’s been
piped to it.

## Adopting ES6 syntax (transform-stream-es6.js)

This example uses ES6 syntax to create a custom transform stream that reads from `file.txt`, converts
the content into uppercase, and writes it to `newFile.txt`. The `Uppercase` class, extending the
`Transform` class, overrides the `_transform` method to process data chunks, converting them
into uppercase with `chunk.toString().toUpperCase()` before pushing them to the write
stream. The callback function, `callback()`, is invoked to indicate the completion of the current
chunk’s processing, allowing the stream to handle the next chunk and maintain a regulated flow of data.

## Using map and filter functions

Run `node map-stream.js` and `node filter-stream.js`

More recent versions of Node.js, later than version 16.4.0, provide Experimental array-like methods
for readable streams. These methods can be used similarly to the array methods – for example, the
`Readable.map()` and `Readable.filter()` methods provide similar functionality to
`Array.prototype.map()` and `Array.prototype.filter()`.

The `map()` method can be used to map over the stream. For every chunk in the stream, the specified
function will be called.

The `Readable.filter()` method can be used to filter a readable stream.

These are two recent function additions that provide array-like methods on readable streams. Many
more array-like methods are now available on streams:

- `.drop()`

- `.every()`

- `.filter()`

- `.find()`

- `.flatMap()`

- `.forEach()`

- `.map()`

- `.reduce()`

- `.some()`

- `.take()`

- `.toArray()`

More information, including the usage and parameters of these methods, can be found in the Node.js
Stream API documentation: <https://nodejs.org/docs/latest-v22.x/api/stream.html>.
