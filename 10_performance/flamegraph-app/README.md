# Interpreting flame graphs

A flame graph is a visual tool that allows us to identify “hot code paths” within our application. The
term “hot code path” is used to describe execution paths in the program that consume a relatively
large amount of time, which can indicate a bottleneck in an application.

Flame graphs provide a visualization of an application’s call stack during execution. From this
visualization, it’s possible to determine which functions are spending the most time on the CPU while
the application is running.

Here we’re going to use the `0x` flame graph tool (<https://github.com/davidmarkclements/0x>)
to generate a flame graph for our Node.js application.

We’ll be using the `0x` tool to profile our server and generate a flame graph. We’ll also
need to use the `autocannon` tool to generate a load on our application

Now, instead of starting our server with the node binary, we need to start it with the `0x`
executable. If we open the `package.json` file, we’ll see that the `npm start` script is
`node ./bin/www`. We need to substitute the `node` binary in the terminal command with `0x`:

```Bash
$ pnpm dlx 0x ./bin/www
🔥  Flamegraph generated in
file:///... /flamegraph-app/8256.0x/flamegraph.html

```

Now, we need to generate some load on the server. In a new terminal window, use the
`autocannon` benchmarking tool to generate a load by running the following command:

```Bash
$ pnpm dlx autocannon --connections 100 http://localhost:3000
```

Expect to see the following output when the autocannon load test has been completed:

```Bash
Running 10s test @ http://localhost:3000/
100 connections


┌─────────┬───────┬────────┬────────┬─────────┬───────────┬──────────┬─────────┐
│ Stat    │ 2.5%  │ 50%    │ 97.5%  │ 99%     │ Avg       │ Stdev    │ Max     │
├─────────┼───────┼────────┼────────┼─────────┼───────────┼──────────┼─────────┤
│ Latency │ 63 ms │ 183 ms │ 746 ms │ 4508 ms │ 277.82 ms │ 696.8 ms │ 8219 ms │
└─────────┴───────┴────────┴────────┴─────────┴───────────┴──────────┴─────────┘
┌───────────┬─────────┬─────────┬────────┬────────┬────────┬─────────┬─────────┐
│ Stat      │ 1%      │ 2.5%    │ 50%    │ 97.5%  │ Avg    │ Stdev   │ Min     │
├───────────┼─────────┼─────────┼────────┼────────┼────────┼─────────┼─────────┤
│ Req/Sec   │ 61      │ 61      │ 348    │ 560    │ 357    │ 135.13  │ 61      │
├───────────┼─────────┼─────────┼────────┼────────┼────────┼─────────┼─────────┤
│ Bytes/Sec │ 24.4 kB │ 24.4 kB │ 139 kB │ 223 kB │ 142 kB │ 53.9 kB │ 24.3 kB │
└───────────┴─────────┴─────────┴────────┴────────┴────────┴─────────┴─────────┘

Req/Bytes counts sampled once per second.
# of samples: 10

4k requests in 10.05s, 1.42 MB read
```

Note that in this load test, our server was handling `357` requests per second on average.

Return to the terminal window where the server was started and press Ctrl + C. This will stop
the server. At this point, 0x will convert the captured stacks into a flame graph.

Expect to see the following output after pressing Ctrl + C. This output details the location where
`0x` has generated the flame graph. Observe that the `0x` tool has created a directory named
`8256.0x`, where `8256` is the process identifier (PID) of the server process:

Open the `flamegraph.html` file that’s been generated in the `flamegraph-app` directory
with Google Chrome. You can do this by copying the path to the flame graph and pasting it into
the Google Chrome address bar. Expect to see the generated flame graph and some controls.

Observe that the bars in the flame graph are of different shades. A darker (redder) shade
indicates a hot code path.

**Important note:**
Each generated flame graph may be slightly different, even when running the same load test.
The flame graph that’s generated on your device is likely to look different from the output shown
here. This is due to the non-deterministic nature of the profiling process, which may
have subtle impacts on the flame graph’s output. However, generally, the flame graph’s overall
results and bottlenecks are identified consistently.

Identify one of the darker frames. In the example flame graph, we can see that the
`readFileSync()` frame method has a darker shade – indicating that that function has
spent a relatively large amount of time on the CPU:

Click on the darker frame. If it’s difficult to identify the frame, you can enter `readFileSync`
into the search bar (top right), after which the frame will be highlighted. Upon clicking on the
frame, `0x` will expand the parent and child stacks of the selected frame

From the drilled-down view, we can see the hot code path. From the flame graph, we can make
an educated guess about which functions it would be worthwhile to invest time in optimizing.
In this case, we can see references to `handleTemplateCache()`.
Benchmarking HTTP requests, we learned how `pug` reloads a template for each request when
in development mode. This is the cause of this bottleneck. Let’s change the application so that
it runs in production mode and see what the impact is on the load test results and flame graph.

Restart the Express.js server in production mode with the following command:
`$ NODE_ENV=production 0x ./bin/www`
Rerun the load test using the autocannon tool:
`$ autocannon --connections 100 http://localhost:3000`

```Bash
Running 10s test @ http://localhost:3000/
100 connections


┌─────────┬───────┬───────┬───────┬────────┬─────────┬──────────┬─────────┐
│ Stat    │ 2.5%  │ 50%   │ 97.5% │ 99%    │ Avg     │ Stdev    │ Max     │
├─────────┼───────┼───────┼───────┼────────┼─────────┼──────────┼─────────┤
│ Latency │ 20 ms │ 35 ms │ 94 ms │ 165 ms │ 43.5 ms │ 90.37 ms │ 2503 ms │
└─────────┴───────┴───────┴───────┴────────┴─────────┴──────────┴─────────┘
┌───────────┬────────┬────────┬────────┬─────────┬─────────┬──────────┬────────┐
│ Stat      │ 1%     │ 2.5%   │ 50%    │ 97.5%   │ Avg     │ Stdev    │ Min    │
├───────────┼────────┼────────┼────────┼─────────┼─────────┼──────────┼────────┤
│ Req/Sec   │ 602    │ 602    │ 2,351  │ 3,953   │ 2,272.6 │ 1,046.05 │ 602    │
├───────────┼────────┼────────┼────────┼─────────┼─────────┼──────────┼────────┤
│ Bytes/Sec │ 240 kB │ 240 kB │ 938 kB │ 1.58 MB │ 907 kB  │ 417 kB   │ 240 kB │
└───────────┴────────┴────────┴────────┴─────────┴─────────┴──────────┴────────┘

Req/Bytes counts sampled once per second.
# of samples: 10

23k requests in 10.05s, 9.07 MB read
```

From the results of the load test, we can see that our server is handling more requests per
second. In this run, our load test reported that our server handled an average of around `2272`
requests per second, up from around `357` before we changed the Express.js server so that it
runs in production mode.

As before, once the `autocannon` load test is complete, stop your server using _Ctrl + C_. A new
flame graph will be generated. Open the new flame graph in your browser and observe that
the new flame graph is a different shape from the first. Observe that the second flame graph
highlights a different set of darker frames. This is because we’ve resolved our first bottleneck.
Hot code paths are relative. Despite having increased the performance of our application, the
flame graph will identify the next set of hot code paths.

With that, we’ve used `0x` to generate a flame graph, which has enabled us to identify a bottleneck in
our application.

## How it works…

We used the `0x` tool to profile and generate a flame graph for our application. Our
application was a small, generated Express.js web server. The `autocannon` tool was used to add load
to our web server so that we could produce a flame graph that’s representative of a production workload.

To use the `0x` tool, we had to start our server with `0x`. When we start an application with `0x`, two
processes are started.

The first process uses the Node.js binary, `node`, to start our program. When `0x` starts the node
process, it passes the `--perf-basic-prof` command-line flag to the process. This command-
line flag allows C++ V8 function calls to be mapped to the corresponding JavaScript function calls.

The second process starts the local system’s stack tracing tool. On Linux, the `perf` tool will be
invoked, whereas on macOS and SmartOS, the `dtrace` tool will be invoked. These tools capture the
underlying C-level function calls.

The underlying system stack tracing tool will take samples. A **sample** is a snapshot of all the functions
being executed by the CPU at the time the sample was taken, which will also record the parent
function calls.

The sampled stacks are grouped based on the call hierarchy, grouping the parent and child function
calls together. These groups are what’s known as a **flame**, hence the name **flame graph**. The same
function may appear in multiple flames.

Each line in a flame is known as a frame. A **frame** represents a function call. The width of the frame
corresponds to the amount of time that that function was observed by the profiler on the CPU. The
time representation of each frame aggregates the time that all child functions take as well, hence the
triangular or _flame_ shape of the graph.

Darker (redder) frames indicate that a function has spent more time at the top of the stack relative
to the other functions. This means that this function is spending a lot of time on the CPU, which
indicates a potential bottleneck.

**Important note:**
Chrome DevTools can also be used to profile the CPU, which can help identify bottlenecks. Using
the `--inspect` command-line flag, the Node.js process can be debugged and profiled using
Chrome DevTools.
