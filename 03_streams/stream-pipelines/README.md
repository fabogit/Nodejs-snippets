# Building stream pipelines

Run `node pipeline.js`

The Node.js core stream module provides a `pipeline()` method. Similar to how we can use the
Node.js core stream `pipe()` method to pipe one stream to another, we can also use the `pipeline()`
method to chain multiple streams together.

Unlike the `pipe()` method, the `pipeline()` method also forwards errors, making it easier to
handle errors in the stream’s flow.

The `pipeline()` method allows us to pipe streams to one another – forming a flow of streams.
We can pass the following arguments to the stream’s `pipeline()` method:

- `source`: A source stream from which to read data

- `...transforms`: Any number of transform streams to process data (including 0)

- `destination`: A destination stream to write the processed data to

- `callback`: The function to be called when the pipeline is complete

We pass the `pipeline()` method to our series of streams, in the order they need to run, followed
by using a callback function that executes once the pipeline is complete.

The `pipeline()` method elegantly forwards errors that occur in the streams onto the callback. This
is one of the benefits of using the `pipeline()` method over the `pipe()` method.

The `pipeline()` method also cleans up any unterminated streams by calling `stream.destroy()`.

## Promises

Run `node promise-pipeline.js`

In Node.js version 15 and later, there is a suite of asynchronous utility functions for streams that utilize
`Promise` objects instead of callbacks. These functions can be found in the `stream/promises` core
module. This module includes versions of `stream.pipeline()` and `stream.finished()` that are
compatible with promises, providing a more modern and promise-friendly approach to stream handling.

**Important note:**
Previously, the `pipeline()` method may have been converted into Promise form using
the `util.promisify()` utility method. The `util.promisify()` method is used to
convert a callback-style method into `Promise` form. The Streams Promises API replaces the
need to use this.
