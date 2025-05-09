# Developing Node.js Modules

One of the main attractions of Node.js is the massive ecosystem of external third-party libraries.
**Node.js modules** are libraries or a set of functions you want to include in your application. Most modules
will provide an API to expose functionality. The `npm` registry is where most Node.js modules are
stored, where there are over a million Node.js modules available.

This chapter will first cover how to consume existing Node.js modules from the `npm` registry for use
within your applications using the `npm` **command-line interface (CLI)**.

Later we’ll learn how to develop and publish our own Node.js module to the `npm`
registry. There will also be an introduction to using the **ECMAScript Modules (ESM)** syntax, which
is available in all currently supported versions of Node.js. The recipes in this chapter build upon each
other, so it’s recommended you work through them in order.

Here we will cover the following recipes:

- Consuming Node.js modules

- Scaffolding a module

- Writing module code

- Publishing a module

- Using ESM
