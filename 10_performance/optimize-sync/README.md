# Optimizing synchronous functions

Flame graphs allow to detect hot code paths in our applications. Once
a hot code path is identified, we can focus our optimization efforts on it to reduce the bottleneck.

It’s important to optimize any hot code paths as any function that takes a long time to process can
prevent I/O and other functions from executing, impacting the overall performance of your application.

Here we will cover how to micro-benchmark and optimize a synchronous function. A **micro-benchmark**
is a type of performance test that focuses on a small, specific piece of code or functionality
within a larger system. We’ll use Benchmark.js (<https://benchmarkjs.com/>) to create
a micro-benchmark.

We can run the benchmark with the following command:

```Bash
$ node benchmark.js
slow x 231,893 ops/sec ±0.90% (90 runs sampled)
Fastest implementation is slow
```

Let’s generate a flame graph using the `0x` tool. A flame graph can help us identify which of the
lines of our code are spending the most time on the CPU. Generate a flame graph with `0x` by
using the following command:
`$ npx 0x benchmark.js`

Open the flame graph in your browser that should show one pink frame,
indicating a hot code path. Hover over the hotter frames to identify which line of the application
they’re referring to.

In the flame graph, we can see that the hottest function is an anonymous function on line 10 of
`slow.js`. If we look at our code, we’ll see that this points to our use of `Array.reduce()`.

As we suspect that it’s the use of `Array.reduce()` that’s slowing our operations down, we
fix that in `loop.js` rewriting the function in a procedural form (using a for loop) to see whether it
improves the performance.

Rerun the benchmark. This time, it will run both of our implementations and determine which
one is fastest:

```Bash
$ node benchmark.js
slow x 247,958 ops/sec ±1.17% (90 runs sampled)
loop x 7,337,014 ops/sec ±0.86% (94 runs sampled)
Fastest implementation is loop
```

With that, we’ve confirmed that our procedural/loop implementation of the `sumOfSquares()`
function is much faster than the original implementation.

## How it works…

This recipe stepped through the process of optimizing a synchronous function call, starting with the
slow implementation of a `sumOfSquares()` function.

We created a micro-benchmark using `Benchmark.js` to create a baseline measure of our initial
`sumOfSquares()` implementation in `slow.js`. This baseline measure is called a micro-benchmark.
**Micro-benchmarks** are used to benchmark a small facet of an application. In our case, it was for the
single `sumOfSquares()` function.

Once our micro-benchmark was created, we ran the benchmark via `0x` to generate a flame graph.
This flame graph enabled us to identify which frames were spending the most time on the CPU,
which provided us with an indication of which specific line of code within our `sumOfSquares()`
function was the bottleneck.

From the flame graph, we determined that the use of the `map` and `reduce` functions of
`sumOfSquares()` was slowing the operation down. Therefore, we created a second implementation
of `sumOfSquares()`. The second implementation used traditional procedural code (a for loop).
Once we had the second implementation of the function, in `loop.js`, we added it to our benchmarks.
This allowed us to compare the two implementations to see which was faster.

Based on the number of operations that could be handled per second, `loop.js` was found to be
significantly faster than the initial `slow.js` implementation. The benefit of writing a micro-benchmark
is that you have evidence and confirmation of your optimizations.
