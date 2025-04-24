# Benchmarking HTTP requests

As we’ve seen throughout this book, HTTP communications are the foundation of many Node.
js applications and microservices. For these applications, the HTTP requests should be handled
as efficiently as possible. To be able to optimize, we must first record a baseline measure of our
application’s performance. Once we’ve recorded the baseline, we’ll be able to determine the impact
of our optimization efforts.

To create a baseline, it’s necessary to simulate the load on the application and record how it responds.
For an HTTP-based application, we must simulate HTTP requests being sent to the server.

Here we’ll capture a baseline performance measure for an HTTP web server using a tool
named `autocannon` (https://github.com/mcollina/autocannon), which will simulate
HTTP requests.

- Enter the following commands to use the Express.js generator to generate a sample web server:
  `$ pnpm dlx express-generator --no-view benchmarking-http`

- Start the Express.js web server with the following command:
  `$ npm start`

- Navigate to <http://localhost:3000> in your browser.

We’ve confirmed our server has started and is responding to requests at
<http://localhost:3000>. Now, we can use the `autocannon` tool to benchmark our HTTP
requests. Open a new terminal window and enter the following command to run a load test
with `autocannon`:

```Bash
pnpm dlx autocannon --connections 100 http://localhost:3000/
```

While the autocannon load test is running, switch to the terminal window where you started
the web server. You should see a mass of incoming requests.

```Bash
GET / 200 13.876 ms - 176
GET / 200 13.760 ms - 176
GET / 200 13.925 ms - 176
GET / 200 13.833 ms - 176
GET / 200 14.157 ms - 176
GET / 200 13.950 ms - 176
GET / 200 13.975 ms - 176
GET / 200 13.996 ms - 176
GET / 200 14.016 ms - 176
GET / 200 14.046 ms - 176
GET / 200 11.507 ms - 176
GET / 200 11.592 ms - 176
GET / 200 11.607 ms - 176
GET / 200 11.553 ms - 176
GET / 200 11.572 ms - 176
GET / 200 11.776 ms - 176
```

Switch back to the terminal window where you’re running the `autocannon` load test. Once
the load test is complete, you should see an output similar to the following, detailing the results:

```Bash
Running 10s test @ http://localhost:3000/
100 connections


┌─────────┬───────┬───────┬───────┬───────┬──────────┬──────────┬────────┐
│ Stat    │ 2.5%  │ 50%   │ 97.5% │ 99%   │ Avg      │ Stdev    │ Max    │
├─────────┼───────┼───────┼───────┼───────┼──────────┼──────────┼────────┤
│ Latency │ 19 ms │ 30 ms │ 61 ms │ 72 ms │ 31.38 ms │ 11.56 ms │ 159 ms │
└─────────┴───────┴───────┴───────┴───────┴──────────┴──────────┴────────┘
┌───────────┬────────┬────────┬─────────┬─────────┬─────────┬────────┬────────┐
│ Stat      │ 1%     │ 2.5%   │ 50%     │ 97.5%   │ Avg     │ Stdev  │ Min    │
├───────────┼────────┼────────┼─────────┼─────────┼─────────┼────────┼────────┤
│ Req/Sec   │ 1,595  │ 1,595  │ 3,011   │ 4,519   │ 3,137.2 │ 847.04 │ 1,595  │
├───────────┼────────┼────────┼─────────┼─────────┼─────────┼────────┼────────┤
│ Bytes/Sec │ 783 kB │ 783 kB │ 1.48 MB │ 2.22 MB │ 1.54 MB │ 416 kB │ 783 kB │
└───────────┴────────┴────────┴─────────┴─────────┴─────────┴────────┴────────┘

Req/Bytes counts sampled once per second.
# of samples: 10

31k requests in 10.05s, 15.4 MB read
```

Observe the table of results. The first table details the request latency. The average was recorded
as `31.38 ms`. The second table details the request volume. Here, it was recorded that our
server handled an average of `3,137.2` requests per second, with an average throughput of
`1.54 MB` per second.

With that, we’ve learned how to use the autocannon tool to benchmark HTTP requests.

## How it works…

The `autocannon` tool is a cross-platform HTTP benchmarking tool written in Node.js and published
to the `npm` registry.

Here we used `autocannon` to load test our Express.js web server at the
<http://localhost:3000> endpoint. We passed autocannon the `--connections 100` flag. This
flag instructs `autocannon` to allocate a pool of `100` concurrent connections to our server. Had we
omitted this flag, `autocannon` would have defaulted to allocating `10` concurrent connections. The
number of concurrent connections should be altered to best represent the anticipated load on your
server so that you can simulate production workloads.

**Important note:**
This recipe used the full-form command-line flags for autocannon for readability. However, as
with many command-line flags, it’s possible to use an abbreviated form. The `--connections`
flag can be abbreviated to `-c` and the `--duration` flag can be abbreviated to `-d`.

Note that `autocannon` defaults to running the load test for `10` seconds, immediately sending a new
request on each socket after the previous request has been completed. It’s possible to extend the length
of the load test using the `--duration` flag. For example, you could use the following command to
extend the load test shown in this recipe to `20` seconds:

```Bash
$ autocannon --connections 100 --duration 20 http://localhost:3000/
```

By default, `autocannon` outputs the data from the load test in two tables. The first table details the
request latency, while the second table details the request volume.

**Request latency** is the amount of time that’s elapsed between when a request is made, and a response
is received. The request latency table is broken down into various percentiles. The `2.5%` percentile
records the fastest `2.5%` of requests, whereas the `99%` percentile records the slowest `1%` of requests.
When benchmarking requests, it can be useful to record and consider both the best and worst-case
scenarios. The latency table also details the average, standard deviation, and maximum recorded
latency. Generally, the lower the latency, the better.
The request volume table details the number of requests per second (`Req/Sec`) and the throughput,
which is recorded as the number of bytes processed per second (`Bytes/Sec`). Again, the results
are broken down into percentiles so that the best and worst cases can be interpreted. For these two
measures, the higher the number, the better, as it indicates more requests were processed by the server
in the given timeframe.

**Important note:**
For more information about the available autocannon command-line flags, please
refer to the _Usage_ documentation on GitHub: <https://github.com/mcollina/autocannon#usage>.

## There’s more…

Next, we’ll cover how to use autocannon to benchmark HTTP `POST` requests. We’ll also consider
how we can best replicate a production environment during our benchmarks and how this can change
our latency and throughput.

### Benchmarking HTTP POST requests

Previously we benchmarked an HTTP `GET` request. The `autocannon` tool provides allows you
to send requests using other HTTP methods, such as HTTP `POST`.

Let’s see how we can use `autocannon` to send an HTTP `POST` request with a JSON payload.

We need to start `post-server.js`:
`$ node post-server.js`

In a separate terminal window, enter the following command to load test the HTTP `POST`
request. Note that we pass `autocannon` the `--method`, `--headers`, and `--body` flags:

```Bash
$ autocannon --connections 100 --method POST --headers 'content-type=application/json' --body '{ "hello": "world"}' http://localhost:3000/
```

Again `autocannon` will run the load test and output a results summary.

This demonstrates how we can use `autocannon` to simulate other HTTP method requests, including
requests with a payload.
