# Creating object mode transform streams

Run `node object-stream.js`

By default, Node.js streams operate on `String`, `Buffer`, or `Uint8Array` objects. However, it is
also possible to work with Node.js streams in **object mode**. This allows us to work with other JavaScript values (except the `null` value). In object mode, the values that are returned from the stream areeneric JavaScript objects. An example use case for object mode streaming could be implementing
an application that queries a database for a large set of user records and then processes each user
record individually.

The main difference with object mode is that the `highWaterMark` value refers to the number of
objects, rather than bytes. In previous recipes, we learned that the `highWaterMark` value dictates
the maximum number of bytes that are stored in the internal buffer before the stream stops reading
the input. For object mode streams, this value is set to `16` – meaning 16 objects are buffered at a time.

To set a stream in object mode, we must pass `{ objectMode: true }` via the `options` object.

In this example, we created a transform stream called `Name` that aggregates the value of two JSON
properties (`forename` and `surname`) and returns a new property (`name`) with the aggregated value.
The `Name` transform stream is in object mode and both reads and writes objects.

We pipe our `Name` transform stream to the `stringify()` function provided by the `ndjson`
module. The `stringify()` function converts the streamed JSON objects into newline-delimited
JSON. The `stringify()` stream is a transform stream where the writable side is in object mode,
but the readable side isn’t.

With transform streams (and duplex streams), you can independently specify whether the readable
or writable side of the stream is in object mode by supplying the following configuration options:

- `readableObjectMode`: When `true`, the readable side of the duplex stream is in object mode

- `writableObjectMode`: When `true`, the writable side of the duplex stream is in object mode

Note that it is also possible to set different `highWaterMark` values for the readable or writable side of a duplex stream using the following configuration options:

- `readableHighWaterMark`: Configures the `highWaterMark` value for the readable side of the stream

- `writableHighWaterMark`: Configures the `highWaterMark` value for the writable side of the stream

The `readableHighWaterMark` and `writableHighWaterMark` configuration values have no
effect if a `highWaterMark` value is supplied because the `highWaterMark` value takes precedence.
