# Optimizing Performance

Performance optimization is an endless activity. Further optimizations can always be made. The recipes
in this chapter will demonstrate typical performance optimization workflows.

The performance optimization workflow starts with establishing a baseline. Often, this involves
benchmarking our application in some way. In the case of a web server, this could be measuring how
many requests our server can handle per second. A baseline measure must be recorded for us to have
evidence of any performance improvements that have been made.

Once the baseline has been determined, the next step is to identify the bottleneck. The recipes in
this chapter will cover using tools such as flame graphs and memory profilers to help us identify the
specific bottlenecks in an application. Using these performance tools will ensure that our optimization
efforts are invested in the correct place.

Identifying a bottleneck is the first step to understanding where the optimization work should begin,
and performance tools can help us determine the starting point. For instance, a flame graph can identify
a specific function responsible for causing the bottleneck. After making the necessary optimizations,
the changes must be verified by rerunning the initial baseline test. This allows us to have numerical
evidence supporting whether the optimization has improved the application’s performance.
