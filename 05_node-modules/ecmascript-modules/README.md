# Using ECMAScript modules

ESM represents the official standard for packaging JavaScript code for reuse. ESM was introduced in
**ECMAScript 2015 (ES6)** to bring a unified module system to the JavaScript language, a feature that
was absent and in much demand for years. Unlike **CommonJS (CJS)** modules, which were adopted
by Node.js for server-side development, ESM provides a way to statically analyze code for imports
and exports, allowing for optimizations such as tree shaking, which eliminates unused code.

The introduction of ESM into the Node.js ecosystem marked a significant milestone, offering developers
the benefits of a standardized module system that is compatible across different environments, including
browsers, where modules can be natively loaded without the need for bundling tools.

Configuring Node.js to use ESM involves understanding and setting up project structures to accommodate
the new syntax and module resolution strategy. By default, Node.js treats `.js` files as CJS modules,
but with the inclusion of a `"type": "module"` entry in a project’s `package.json` file, Node.
js switches to treating files with the `.js` extension as ESM.

Alternatively, developers can use the `.mjs` extension for JavaScript files intended to be treated as
modules. This setup phase is crucial as it lays the foundation for importing and exporting modules using
the `import` and `export` keywords, respectively, moving away from the `require` and `module.exports`
syntax of CJS. The enablement of ESM in Node.js not only aligns server-side development
with frontend practices but also opens new possibilities for code sharing and modularization across
the JavaScript ecosystem.

The core ESM support is enabled by default and designated with stable status in all currently supported
Node.js versions. However, some individual ESM capabilities remain experimental.

We will create a mini-project that calculates various geometric shapes’ areas and
perimeters. This recipe will serve as an introduction to using ESM in Node.js and demonstrate the
use of named and default exports.

The primary goal of the recipe is to demonstrate how ESM can be leveraged to build
a well-organized, maintainable, and scalable project. We achieve this through the development of a
small application designed to calculate the area and perimeter of geometric shapes.

The project is initiated as a standard Node.js application with a `package.json` file. By setting
`"type": "module"` in the `package.json` file, we instruct Node.js to treat files with the `.js`
extension as ESM files.

The geometry calculations are divided into separate modules for each shape. This modular approach
demonstrates the concept of single responsibility, where each module is tasked with a specific set of
functionalities related to a particular geometric shape. This approach will be familiar to those who
have worked with other **object-oriented programming (OOP)** languages such as Java.

For the circle module (`circle.js`), we implemented functions to calculate the area (exposed as
the default export) and circumference (exposed as a named export) of a circle. The use of a default
export for the primary function illustrates how to expose a module’s main functionality, while named
exports tend to be used for secondary functions.

For the rectangle module (`rectangle.js`), we only included named exports for functions calculating
the area and perimeter of a rectangle. The use of named exports highlights how multiple related
functionalities can be grouped within a single module and exported individually.

We introduced a utility module (`mathUtils.js`) to perform rounding operations. This module’s
existence emphasizes the utility of having shared functionalities abstracted into their modules, making
them reusable across a project.

The main module, `index.js`, serves as the entry point to the application. It dynamically imports the
geometry modules and the utility module, using their functionalities to perform calculations based
on user input or predefined values. While a simplified example, it demonstrates how to import both
default and named exports from modules, highlighting the versatility of ESM in handling various
export types.

## More on modules

CJS remains widely used in Node.js applications due to its long history in the vast ecosystem of `npm`
modules. ESM is being increasingly adopted for new projects due to its native browser support, module
optimization capabilities, and alignment with the ECMAScript standard.

Understanding these differences is critical for developers navigating the Node.js and wider JavaScript
ecosystem, especially when working on applications and projects that may require integrating both
module types.

**Important note:**
In the current state of Node.js development, developers often have to navigate both module
systems. In some cases, this is required due to certain `npm` modules now exclusively supporting ESM.

### Differences between CJS and ESM

The differences between CJS and ESM in Node.js are foundational to understanding how to effectively
use modules in JavaScript applications. Let’s take a closer look at these:

| CJS                                                                                                                                                                      | ESM                                                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Uses `require()` for importing modules and `module.exports` or `exports` for exporting.                                                                                  | Uses the `import` and `export` statements for importing and exporting modules.                                                                  |
| Loads modules synchronously.                                                                                                                                             | Supports asynchronous loading, allowing for dynamic `import()` statements.                                                                      |
| Supports non-static, runtime module resolution allowing for conditional imports based on runtime conditions.                                                             | Static structure enables `import`/`export` statements to be analyzed at compile time, leading to potential optimizations by JavaScript engines. |
| CJS modules can use ESM through dynamic `import()` statements or by creating wrapper modules, but attention is required to avoid issues such as the dual package hazard. | ESM can import CJS modules using default imports.                                                                                               |
| Exports are copied upon import, meaning changes to the exported value after import are not reflected in the importing module.                                            | Supports live bindings, allowing imported values to update if they change in the exporting module.                                              |
| Does not support **top-level await** as it relies on synchronous module loading.                                                                                         | Enables Top-level Await, enabling modules to wait for asynchronous operations before proceeding.                                                |
| Typically uses the `.js` extension, although an explicit `.cjs` extension may be used.                                                                                   | While `.js` can be used (with `"type": "module"` in `package.json`), the `.mjs` extension can be used to explicitly mark files as ESM.          |
| Modules have their own scope but share a global object.                                                                                                                  | Modules are executed in **strict mode** by default and have their own scope, with a more isolated environment.                                  |

### Interoperability with CJS

One of the crucial aspects of adopting ESM modules in Node.js projects is understanding how they
can interoperate with the traditional CJS module system. Given the vast ecosystem of existing Node.js
packages and applications that use CJS, it is essential to grasp how to work with both module systems
in a single project. This section explores the mechanisms and practices for achieving interoperability
between ESM and CJS modules, ensuring a smooth transition and integration process.

ESM can import CJS modules using the `import` statement, thanks to Node.js’s built-in interoperability
support. However, because CJS modules are not statically analyzable in the same way as ESM, there
are some nuances to be aware of:

- **Default imports:** When importing a CJS module in an ESM file, the entire module’s exports
  are treated as a single default export. This means you cannot use named imports directly from
  a CJS module:

  ```JavaSCript
  // Importing a CommonJS module in ESM
  import cjsModule from './module.cjs';
  console.log(cjsModule.someFunction());
  ```

- **Dynamic imports:** You can dynamically import CJS modules using the import() function.
  This approach returns a Promise that resolves with the CJS module’s exports, allowing for
  asynchronous module loading:

  ```JavaScript
  // Dynamically importing a CommonJS module
  import('./module.cjs').then((cjsModule) => {
    console.log(cjsModule.someFunction());
  });
  ```

- **Exporting ESM modules for use in CJS:** When it comes to using ESM modules in CJS code,
  the process is somewhat more constrained due to the synchronous nature of CJS’s `require()`
  function, which does not support ESM’s asynchronous module loading. However, there
  are workarounds.
  One common approach is to create a CJS wrapper module that dynamically imports the ESM module
  and then exports its functionalities. This requires using asynchronous patterns such as `async`,
  `await`, or promises:

  ```JavaSCript
  // CJS wrapper for an ESM module
  const esmModule = await import('./module.mjs');
  module.exports = esmModule.default;
  ```

Projects that offer both ESM and CJS entry points need to be aware of the dual package hazard, where
a single package loaded in both formats might lead to state issues or duplicated instances.

When producing a module, it is recommended that you document if your package or application
supports both ESM and CJS, with guidance on how consumers can import it into their projects.
Should you dual publish, it is also recommended that you thoroughly test your module in both ESM
and CJS environments to catch any interoperability issues.

**Important Note:**
Node.js now offers Experimental support for loading ES modules using `require()` with
the `--experimental-require-module` flag. This feature enables CommonJS modules
to load ES modules under specific conditions, such as when the file has a `.mjs` extension or
when `"type": "module"` is set in the nearest `package.json`. However, if the module or its
dependencies contain top-level await, the `ERR_REQUIRE_ASYNC_MODULE` error will be
thrown, requiring `import()` for asynchronous modules.

This functionality is designed to improve interoperability between CommonJS and ES modules,
but as an experimental feature, it may change in future Node.js versions. For more information,
visit: <https://nodejs.org/api/modules.html#loading-ecmascript-modules-using-require>.

### Advanced topics in ECMAScript Modules

Advancing your understanding of ESM within Node.js involves exploring more complex features and
strategies that can optimize and enhance the functionality of your applications. There are some further
advanced topics you can explore for benefits and considerations for developers working with ESM:

- **Dynamic import expressions:** Dynamic imports allow you to load modules on an as-needed
  basis, using the `import()` function that returns a `Promise`. This feature is particularly useful
  for reducing initial load times and optimizing resource utilization in applications by splitting
  the code into smaller chunks that are loaded only when required.

- **Module caching and preloading:** Node.js caches imported modules to avoid reloading them
  each time they are required in the application, enhancing performance. Preloading modules
  involves loading modules before they are needed, potentially speeding up application startup
  by reducing delays associated with loading modules at runtime.

- **Tree shaking:** Tree shaking is a term commonly associated with static code analysis tools and
  bundlers (such as **Webpack**). It refers to the elimination of unused code from a final bundle.
  For tree shaking to be effective, modules must use static `import` and `export` statements, as
  this allows the bundler to determine which exports are used and which can be safely removed,
  leading to smaller and more efficient bundles.

- **Module resolution customization:** It is also possible to customize module resolution by
  configuring how import specifiers are resolved to actual module files. Node.js provides an
  experimental feature named **customization hooks**, which allows you to customize module
  resolution and loading by registering a file that exports hooks. For more information, refer to
  the Node.js API documentation for the feature: <https://nodejs.org/api/module.html#customization-hooks>.
