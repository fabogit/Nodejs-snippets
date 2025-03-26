# Streams

The Node.js core `fs` module relies on the underlying
Node.js `stream` core module. Generally, the Node.js `stream` core module is not interacted with
directly. You’d typically only interact with the Node.js `stream` implementation via higher-level APIs, such as those exposed by the `fs` module.

**Important note:**
For more information about the underlying Node.js streams implementations and API, please
refer to the Node.js stream module documentation at <https://nodejs.org/docs/latest-v22.x/api/stream.html>.

## Read/Write streams

Run `node write-stream.js` then `node read-stream.js`

We created a writable stream, via the `fs.createWriteStream()` method, to write our file
contents sequentially. The `fs.createWriteStream()` method accepts two parameters. The first
is the path of the file to write to, while the second is an `options` object that can be used to supply
configuration to the stream.

The following table details the configuration that we can supply to the `fs.createWriteStream()`
method via an `options` object:

| Option        | Description                                                                                                                                       | Default Value |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| flags         | Defines File System flags.                                                                                                                        | w             |
| encoding      | The encoding of the file.                                                                                                                         | utf8          |
| fd            | The fd value is expected to be a file descriptor. When this value is supplied, the path argument will be ignored.                                 | null          |
| mode          | Sets the file permissions.                                                                                                                        | 0o666         |
| autoClose     | When autoClose is set to true, the file descriptor will be closed automatically. When false, the file descriptor will need to be closed manually. | true          |
| emitClose     | Controls whether the stream emits a close event after it has been destroyed.                                                                      | false         |
| start         | Can be used to specify, as an integer, the position to startwriting data.                                                                         | 0             |
| fs            | Used to override fs implementations.                                                                                                              | null          |
| signal        | Used to specify an AbortSignal object to programmatically cancel the writing of the stream.                                                       | null          |
| highWaterMark | Used to specify the maximum number of bytes that can be buffered before backpressure is applied.                                                  | 16384         |

**Important note:**
For more information on File System `flags`, please refer to <https://nodejs.org/api/fs.html#fs_file_system_flags>.

Then, we created a readable stream to read the contents of our file sequentially. The `createRead-Stream()` method is an abstraction of a readable stream. Again, this method expects two param-eters – the first being the path to the contents to read, and the second being an `options` object.

The following table details the options we can pass to the `createReadStream()` method via an options object:

| Option        | Description                                                                                                                                       | Default Value |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| flags         | Defines File System flags.                                                                                                                        | r             |
| encoding      | The encoding of the file.                                                                                                                         | null          |
| fd            | The fd value is expected to be a file descriptor. When this value is supplied, the path argument will be ignored.                                 | null          |
| mode          | Sets the file permissions, but only when the file is created.                                                                                     | 0o666         |
| autoClose     | When autoClose is set to true, the file descriptor will be closed automatically. When false, the file descriptor will need to be closed manually. | true          |
| emitClose     | Controls whether the stream emits a close event after it has been destroyed.                                                                      | false         |
| start         | Can be used to specify, as an integer, the position to startreading data.                                                                         | 0             |
| end           | Can be used to specify, as an integer, the position to stopreading data.                                                                          | Infinity      |
| highWaterMark | UDictates the maximum number of bytes that are stored in theinternal buffer before the stream stops reading the input.                            | 64 KiB        |
| fs            | Used to override fs implementations.                                                                                                              | null          |
| signal        | Used to specify an AbortSignal object to programmaticallycancel the reading of the stream.                                                        | null          |

In `read-stream.js`, we registered a `data` event handler that executed each time our readable
stream read a chunk of data. We could see the individual chunks’ outputs on the screen as they were read:

```bash
Read chunk: <Buffer 20 62 75 69 6c 74 20 6f 6e 20 47 6f 6f 67 6c 65 20
43 68 72 6f 6d 65 27 73 20 56 38 20 4a 61 76 61 53 63 72 69 70 74 20
65 6e 67 69 6e 65 2e 0a 4e 6f ... 29149 more bytes>
```

Once all the file data was read, our `end` event handler triggered – resulting in the **No more data message**.

All Node.js streams are instances of the `EventEmitter` class (<https://nodejs.org/api/events.html#events_class_eventemitter>). Streams emit a series of different events.

The following events are emitted on readable streams:

- `close`: Emitted when the stream and any of the stream’s resources have been closed. No
  further events will be emitted.

- `data`: Emitted when new data is read from the stream.

- `end`: Emitted when all available data has been read.

- `error`: Emitted when the readable stream experiences an error.

- `pause`: Emitted when the readable stream is paused.

- `readable`: Emitted when there is data available to be read.

- `resume`: Emitted when a readable stream resumes after being in a paused state.

The following events are emitted on writable streams:

- `close`: Emitted when the stream and any of its resources have been closed. No further events
  will be emitted.

- `drain`: Emitted when the writable stream can resume writing data.

- `error`: Emitted when the writeable stream experiences an error.

- `finish`: Emitted when the writeable stream has ended, and all writes have been completed.

- `pipe`: Emitted when the `stream.pipe()` method is called on a readable stream.

- `unpipe`: Emitted when the `stream.unpipe()` method is called on a readable stream.

## Readable streams with async iterators

Run `node for-await-read-stream.js`

For more information on the `for await...of` syntax, please refer to the MDN web docs
(<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of>).

**Important note:**
Generally, developers should opt to use one of the Node.js streams API styles as using a
combination of `on('data')`, `on('readable')`, `pipe()`, and/or async iterators could
lead to unclear behavior.

## Generating readable streams with Readable.from()

Run `node async-generator.js`

The `Readable.from()` method is exposed by the Node.js core stream module. This method is
used to construct readable streams with iterators.

Note the use of the `function*` syntax. This syntax defines a generator function. For more details
on generator syntax, please refer to the MDN web docs
(<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function>\*).

## Interacting with paused streams

Run `node paused-stream.js`

A Node.js stream can be in either flowing or paused mode. In flowing mode, data chunks are read automatically, whereas in paused mode, the `stream.read()` method must be called to read the chunks of data.

By default, a readable stream is in paused mode. However, a readable stream will switch to flowing
mode in the following instances:

- When a `data` event handler is registered

- When the `pipe()` method is called

- When the `resume()` method is called

Since our program in this recipe did none of these, our stream remained in paused mode.
If a readable stream was in flowing mode, it would switch back to paused mode in the following instances:

- When the `pause()` method is called and there are no pipe destinations

- When the `unpipe()` method is called on all pipe destinations

We added a `readable` event handler to our readable stream. If the readable stream was already
in flowing mode, a readable event handler being registered would stop the stream from flowing (it’s
switched to paused mode).

When the readable stream is in paused mode, it is necessary to manually call the `readableStream.read()`
method to consume the stream data. In this recipe, we added logic within our `readable`
event handler that continued to read the stream data until the data value was `null`. The data value
being `null` indicates that the stream has ended (all currently available data has been read). The
`readable` event can be emitted multiple times, indicating that more data has become available.

When a stream is in paused mode, we can have more control over when the data is being read.
Essentially, we’re pulling the data from the stream, rather than it being pushed automatically.

**Important note:**
Generally, if possible, it’s worthwhile using the `pipe()` method to handle the consumption
data of a readable stream as memory management is handled automatically.
