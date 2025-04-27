# Optimizing asynchronous functions

The Node.js runtime was built with I/O in mind, hence its asynchronous programming model. In the
previous recipes of this chapter, we explored how to diagnose performance issues within synchronous
JavaScript functions.

However, a performance bottleneck may occur as part of an asynchronous workflow. In this recipe,
we’ll cover profiling and optimizing an asynchronous performance problem.
Getting ready

Here we’ll diagnose a bottleneck in an Express.js web server that communicates with a
MongoDB database.

To start MongoDB, we’ll use Docker. Ensuring that you have Docker
running, enter the following command in your terminal to initialize a MongoDB database:
`$ docker run --publish 27017:27017 --name node-mongo --detach mongo:8`

Run the `values.js` script to populate the database for this recipe:
`$ node values.js`

Start the server by entering the following command in your terminal:

```Bash
$ node server.js
Server is running on port 3000
```

Navigate to <http://localhost:3000> in your browser to check that the server is running.
Expect to see a message printing the average of the random values we persisted to the database
running `values.js`.

In a second terminal, we’ll use the `autocannon` benchmarking tool to simulate a load on
the server:

```Bash
$ autocannon --connections 500 http://localhost:3000
unning 10s test @ http://localhost:3000/
500 connections


┌─────────┬────────┬─────────┬─────────┬─────────┬────────────┬───────────┬─────────┐
│ Stat    │ 2.5%   │ 50%     │ 97.5%   │ 99%     │ Avg        │ Stdev     │ Max     │
├─────────┼────────┼─────────┼─────────┼─────────┼────────────┼───────────┼─────────┤
│ Latency │ 992 ms │ 2005 ms │ 2745 ms │ 4889 ms │ 1951.19 ms │ 584.34 ms │ 7067 ms │
└─────────┴────────┴─────────┴─────────┴─────────┴────────────┴───────────┴─────────┘
┌───────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
│ Stat      │ 1%      │ 2.5%    │ 50%     │ 97.5%   │ Avg     │ Stdev   │ Min     │
├───────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│ Req/Sec   │ 78      │ 78      │ 253     │ 355     │ 238.8   │ 73.23   │ 78      │
├───────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│ Bytes/Sec │ 20.5 kB │ 20.5 kB │ 66.6 kB │ 93.4 kB │ 62.8 kB │ 19.3 kB │ 20.5 kB │
└───────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘

Req/Bytes counts sampled once per second.
# of samples: 10

3k requests in 10.13s, 628 kB read
```

This load test shows an average of around `238` requests per second.

Now, let’s see where the bottlenecks are in our application. We’ll use the `0x` tool to generate a
flame graph. Restart the server with the following command:
`$ 0x server.js`

In the second terminal, let’s simulate a load on the server again using the autocannon tool:

```Bash
$ autocannon --connections 500 http://localhost:3000

Running 10s test @ http://localhost:3000/
500 connections


┌─────────┬─────────┬─────────┬─────────┬─────────┬────────────┬──────────┬─────────┐
│ Stat    │ 2.5%    │ 50%     │ 97.5%   │ 99%     │ Avg        │ Stdev    │ Max     │
├─────────┼─────────┼─────────┼─────────┼─────────┼────────────┼──────────┼─────────┤
│ Latency │ 1294 ms │ 1992 ms │ 5012 ms │ 8226 ms │ 2068.39 ms │ 985.7 ms │ 9985 ms │
└─────────┴─────────┴─────────┴─────────┴─────────┴────────────┴──────────┴─────────┘
┌───────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
│ Stat      │ 1%      │ 2.5%    │ 50%     │ 97.5%   │ Avg     │ Stdev   │ Min     │
├───────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│ Req/Sec   │ 6       │ 6       │ 212     │ 341     │ 207.4   │ 83.29   │ 6       │
├───────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│ Bytes/Sec │ 1.58 kB │ 1.58 kB │ 55.8 kB │ 89.7 kB │ 54.5 kB │ 21.9 kB │ 1.58 kB │
└───────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘

Req/Bytes counts sampled once per second.
# of samples: 10

3k requests in 10.13s, 545 kB read
23 errors (23 timeouts)
```

Stop the server and open the generated flame graph in your browser.

The darker/more red frames can indicate bottlenecks in our application.
In our example, the `deserializeObject()` function appears to be the hottest,
meaning it was spending the most amount of time on the
CPU. This is a commonly observed bottleneck in MongoDB-based applications. The bottleneck
in `deserializeObject()` is related to the large amount of data we’re querying and receiving
from our MongoDB instance
.
Let’s try and solve this bottleneck by precomputing and storing the average in the database.
This should help by reducing the amount of data we request from MongoDB and removing
the need to calculate the average. We’ll create a script called `calculate-average.js` that
calculates the average and stores it in MongoDB.

Run the `calculate-averages.js` script to calculate and store the average in the database:

```Bash
$ node calculate-average.js
Stored average in database.
```

Now, we can rewrite the server so that it returns the stored average, rather than calculating it
upon each request, let’s rerun the autocannon benchmark. Start the server with `$ node server-no-process.js`.
Then, in a second terminal window, rerun the autocannon load test:

```Bash
$ autocannon --connections 500 http://localhost:3000

Running 10s test @ http://localhost:3000/
500 connections


┌─────────┬────────┬────────┬────────┬────────┬───────────┬───────────┬────────┐
│ Stat    │ 2.5%   │ 50%    │ 97.5%  │ 99%    │ Avg       │ Stdev     │ Max    │
├─────────┼────────┼────────┼────────┼────────┼───────────┼───────────┼────────┤
│ Latency │ 165 ms │ 242 ms │ 551 ms │ 703 ms │ 278.53 ms │ 104.41 ms │ 944 ms │
└─────────┴────────┴────────┴────────┴────────┴───────────┴───────────┴────────┘
┌───────────┬────────┬────────┬────────┬────────┬─────────┬────────┬────────┐
│ Stat      │ 1%     │ 2.5%   │ 50%    │ 97.5%  │ Avg     │ Stdev  │ Min    │
├───────────┼────────┼────────┼────────┼────────┼─────────┼────────┼────────┤
│ Req/Sec   │ 644    │ 644    │ 1,950  │ 2,613  │ 1,784.2 │ 592.39 │ 644    │
├───────────┼────────┼────────┼────────┼────────┼─────────┼────────┼────────┤
│ Bytes/Sec │ 169 kB │ 169 kB │ 513 kB │ 687 kB │ 469 kB  │ 156 kB │ 169 kB │
└───────────┴────────┴────────┴────────┴────────┴─────────┴────────┴────────┘

Req/Bytes counts sampled once per second.
# of samples: 10

18k requests in 10.14s, 4.69 MB read
```

Here, we can see that the average number of requests per second has increased from around `207`
in `server.js` to `1784` using the precomputed average in `server-no-processing.js`.

Here we learned how obtaining and processing large amounts of data from MongoDB
can introduce bottlenecks in our application. We solved the bottleneck showcased in this recipe by
precomputing and storing the average.

## How it works…

The slowness was caused by both the large amount of data being requested and the calculation of the
average upon each request. By using the `0x` tool to generate a flame graph, it was possible to diagnose
the specific function that was causing the bottleneck.

In this case, the bottleneck was solved by precomputing the average and storing it in the database.
This meant that instead of having to query the database for all values and computing the average on
each request, it was possible to just query and obtain the average directly. This showed a significant
increase in performance.

It was worthwhile amending the data model to store the precomputed average so that it didn’t need to
be calculated on each request. However, in a real application, it may not always be possible to edit the
data model to store computed values. When building a new application, it’s worth considering what
data should be stored in the data model to minimize computation on the live server.

Micro-optimizations, such as precomputing an average, can enhance performance by reducing
runtime computation. These small improvements can boost efficiency, especially under heavy load.
However, premature optimizations can complicate code, making maintenance harder. As such, it’s
usually recommended to prioritize optimizations that offer substantial performance gains for your
application and end users.
