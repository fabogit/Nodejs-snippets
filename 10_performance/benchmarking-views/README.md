# Replicating a production environment

When measuring performance, it’s important to replicate the production environment as closely as
possible; otherwise, we may produce misleading results. The behavior of applications in development
and production may differ, which can result in performance differences.

We can use an Express.js-generated application to demonstrate how performance results may differ,
depending on the environment we’re running in.

Use `express-generator` to generate an Express.js application in a new directory named
benchmarking-views. For more information on the Express.js generator.

Here we’ll be using the `pug` view engine to generate a simple HTML page.

```Bash
pnpm dlx express-generator --views=pug benchmarking-views
```

Start the server with the following command: `$ npm start`

In a new terminal window, use autocannon to load test <http://localhost:3000>:

```Bash
pnpm dlx autocannon --connections 100 http://localhost:3000/
Running 10s test @ http://localhost:3000/
100 connections


┌─────────┬────────┬────────┬────────┬────────┬───────────┬───────────┬─────────┐
│ Stat    │ 2.5%   │ 50%    │ 97.5%  │ 99%    │ Avg       │ Stdev     │ Max     │
├─────────┼────────┼────────┼────────┼────────┼───────────┼───────────┼─────────┤
│ Latency │ 109 ms │ 205 ms │ 440 ms │ 477 ms │ 212.55 ms │ 102.77 ms │ 2515 ms │
└─────────┴────────┴────────┴────────┴────────┴───────────┴───────────┴─────────┘
┌───────────┬─────────┬─────────┬────────┬────────┬────────┬─────────┬─────────┐
│ Stat      │ 1%      │ 2.5%    │ 50%    │ 97.5%  │ Avg    │ Stdev   │ Min     │
├───────────┼─────────┼─────────┼────────┼────────┼────────┼─────────┼─────────┤
│ Req/Sec   │ 245     │ 245     │ 433    │ 676    │ 465.6  │ 121.97  │ 245     │
├───────────┼─────────┼─────────┼────────┼────────┼────────┼─────────┼─────────┤
│ Bytes/Sec │ 97.8 kB │ 97.8 kB │ 173 kB │ 270 kB │ 186 kB │ 48.7 kB │ 97.8 kB │
└───────────┴─────────┴─────────┴────────┴────────┴────────┴─────────┴─────────┘

Req/Bytes counts sampled once per second.
# of samples: 10

5k requests in 10.05s, 1.86 MB read
```

In this load test, the average number of requests per second was around 465.6, and the average
throughput was around 186 kB per second. This is considerably slower than the HTTP `GET`
request that we benchmarked in the main recipe.

The reason why the requests are slower is that when in development mode, the pug templating engine
will reload the template for every request. This is useful in development mode because changes to the
template can be reflected without having to restart the server. When the mode is set to production,
Express.js will no longer reload the template for every request. This will result in performance differences.

Restart the Express.js server in production mode using the following command:

```Bash
$ NODE_ENV=production npm start
```

Now, in your other terminal window, rerun the same benchmark test using autocannon:

```Bash
$ autocannon --connections 100 http://localhost:3000/
Running 10s test @ http://localhost:3000/
100 connections


┌─────────┬───────┬───────┬───────┬───────┬──────────┬──────────┬────────┐
│ Stat    │ 2.5%  │ 50%   │ 97.5% │ 99%   │ Avg      │ Stdev    │ Max    │
├─────────┼───────┼───────┼───────┼───────┼──────────┼──────────┼────────┤
│ Latency │ 21 ms │ 32 ms │ 79 ms │ 99 ms │ 37.17 ms │ 22.13 ms │ 853 ms │
└─────────┴───────┴───────┴───────┴───────┴──────────┴──────────┴────────┘
┌───────────┬────────┬────────┬─────────┬─────────┬──────────┬────────┬────────┐
│ Stat      │ 1%     │ 2.5%   │ 50%     │ 97.5%   │ Avg      │ Stdev  │ Min    │
├───────────┼────────┼────────┼─────────┼─────────┼──────────┼────────┼────────┤
│ Req/Sec   │ 1,064  │ 1,064  │ 2,553   │ 4,031   │ 2,654.19 │ 869.86 │ 1,064  │
├───────────┼────────┼────────┼─────────┼─────────┼──────────┼────────┼────────┤
│ Bytes/Sec │ 425 kB │ 425 kB │ 1.02 MB │ 1.61 MB │ 1.06 MB  │ 347 kB │ 425 kB │
└───────────┴────────┴────────┴─────────┴─────────┴──────────┴────────┴────────┘

Req/Bytes counts sampled once per second.
# of samples: 11

29k requests in 11.05s, 11.6 MB read
```

In the second load test, we can see that the average number of requests per second has increased to
approximately `2,654.19` (up from `465.6`), and the throughput has increased to `1.06` MB per second (up
from `186` kB). This performance increase is due to the template being cached when in production mode.

This highlights the need to benchmark our application in an environment that best represents the
expected production environment.
