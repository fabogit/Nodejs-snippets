# Generating a microservice with LoopBack (loopback-bookstore)

This application is generated using [LoopBack 4 CLI](https://loopback.io/doc/en/lb4/Command-line-interface.html) with the
[initial project layout](https://loopback.io/doc/en/lb4/Loopback-application-layout.html).

## Install dependencies

By default, dependencies were installed when this application was generated.
Whenever dependencies in `package.json` are changed, run the following command:

```sh
npm install
```

To only install resolved dependencies in `package-lock.json`:

```sh
npm ci
```

## Run the application

```sh
npm start
```

You can also run `node .` to skip the build step.

Open http://127.0.0.1:3000 in your browser.

## Rebuild the project

To incrementally build the project:

```sh
npm run build
```

To force a full build by cleaning up cached artifacts:

```sh
npm run rebuild
```

## Fix code style and formatting issues

```sh
npm run lint
```

To automatically fix such issues:

```sh
npm run lint:fix
```

## Other useful commands

- `npm run migrate`: Migrate database schemas for models
- `npm run openapi-spec`: Generate OpenAPI spec into a file
- `npm run docker:build`: Build a Docker image for this application
- `npm run docker:run`: Run this application inside a Docker container

## Tests

```sh
npm test
```

## What's next

Please check out [LoopBack 4 documentation](https://loopback.io/doc/en/lb4/) to
understand how you can continue to add features to this application.

[![LoopBack](<https://github.com/loopbackio/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)

---

**LoopBack** (<https://loopback.io/>) is an extensible open source Node.js framework that is
purpose-built for creating REST APIs and microservices. Early versions of LoopBack were both inspired
by and based directly on the Express.js web framework. The most recent version, LoopBack 4, went
through a significant refactor and was rewritten in TypeScript. This refactor allowed the maintainers
to expand the features of LoopBack without being restricted by the technical implementation decisions
made in prior versions.

## Getting ready

Here we’re going to use the LoopBack Command-Line Interface (CLI) to generate a
Node.js microservice. We need to globally install the LoopBack CLI. Enter the following command
in your terminal:
`$ npm install --global @loopback/cli`

We’re going to generate a RESTful API, which will form our Node.js microservice. The
RESTful API that we will create will mimic a bookstore inventory.

The LoopBack CLI should be available in your path as `lb4`. To start generating the project, we
call the LoopBack CLI, providing a project name. Let’s give our project the name
`loopback-bookstore`. Enter the following command in your terminal:
`$ lb4 loopback-bookstore`

Entering the command will start an interactive interface where the LoopBack CLI will request
information for your new project. For the project description, project root directory, and
application class name, just hit _Enter_ to accept the default names.

The fourth CLI question asks the user which features should be enabled in the project. Hit _Enter_
to enable all features. If you are shown a subsequent command detailing that Yarn is available,
enter `N` to indicate we do not wish to enable it by default.

You should now see the LoopBack CLI scaffolding your application. Expect to see output starting
with the following in your terminal window, detailing files and directories that have been created:

```Bash
? Project description: loopback-bookstore
? Project root directory: loopback-bookstore
? Application class name: LoopbackBookstoreApplication
? Select features to enable in the project Enable eslint, Enable prettier, Enable mocha, Enable loopbackBuild, Enable editorconfig, Enable vscode, Enable docker, Enable repositories, Enable services
    force loopback-bookstore/.yo-rc.json
   create loopback-bookstore/.editorconfig
   create loopback-bookstore/.eslintignore
   create loopback-bookstore/.eslintrc.js
   create loopback-bookstore/.mocharc.json
   create loopback-bookstore/.prettierignore
   create loopback-bookstore/.prettierrc
   create loopback-bookstore/DEVELOPING.md
   create loopback-bookstore/package.json
   create loopback-bookstore/tsconfig.json
   ...
```

The LoopBack CLI has now generated our application. It should have also automatically installed
our npm dependencies.Navigate to the application directory and start the application with
the following commands:

```Bash
$ cd loopback-bookstore
$ npm install
$ npm start
```

If you navigate to <http://localhost:3000> in your browser, you should expect to see
the application running.

Go back to your terminal and press _Ctrl + C_ to stop the application. So far, the LoopBack CLI has
just generated a barebones project structure. Now we can build our bookstore API. We can do
this using LoopBack’s model generator. Enter the following command to start creating a model:

```Bash
$ lb4 model
```

LoopBack’s model generator will open an interactive CLI where we can define the model and its
properties. The model we want to create is a book of the **Entity** type. First, add the `id` property,
which will be a number. You’ll also need to add `author` and `title` properties to the model,
which should both be mandatory and of the string type. Enter these via the interactive session.
The transcript of the session should look like the following:

```Bash
? Model class name: Book
? Please select the model base class Entity (A persisted model with an ID)
? Allow additional (free-form) properties? No
Model Book will be created in src/models/book.model.ts

Let's add a property to Book
Enter an empty property name when done

? Enter the property name: id
? Property type: number
? Is id the ID property? Yes
? Is id generated automatically? Yes

Let's add another property to Book
Enter an empty property name when done

? Enter the property name: author
? Property type: string
? Is it required?: Yes

Let's add another property to Book
Enter an empty property name when done

? Enter the property name: title
? Property type: string
? Is it required?: Yes

Let's add another property to Book
Enter an empty property name when done

? Enter the property name:
   create src/models/book.model.ts

No change to package.json was detected. No package manager install will be executed.
   update src/models/index.ts

Model Book was/were created in src/models

```

Now that we’ve created our model, we need to create our data source using LoopBack’s data
source CLI. Enter the following command in your terminal window:

```Bash
$ lb4 datasource
```

The interactive CLI will request information about the data source. We’re going to use an
in-memory data store. The values you should supply should be `Data source name: local` and
`In-memory DB`. For the last two questions, hit _Enter_ to accept the defaults.
Expect the transcript of your session to match the following:

```Bash
? Datasource name: local
? Select the connector for local:  In-memory db (supported by StrongLoop)
? window.localStorage key to use for persistence (browser only):
? Full path to file for persistence (server only):
   create src/datasources/local.datasource.ts

No change to package.json was detected. No package manager install will be executed.
   update src/datasources/index.ts

Datasource Local was/were created in src/datasources
```

Next, we need to create a LoopBack repository. This is a LoopBack class that binds the data
source and the model. Enter the following command to start the repository generator interface:

```Bash
$ lb4 repository
```

For the repository, we want to use `LocalDatasource` for the **Book** model with a
`DefaultCrudRepository` base class. The terminal should match the following output:

```Bash
? Select the datasource LocalDatasource
? Select the model(s) you want to generate a repository for Book
   create src/repositories/book.repository.ts

No change to package.json was detected. No package manager install will be executed.
   update src/repositories/index.ts

Repository BookRepository was/were created in src/repositories
```

Now, we need to create a LoopBack controller. A LoopBack controller handles the API requests
and responses. Enter the following command to start the controller generator interface:

```Bash
$ lb4 controller
```

Our controller should be a **REST Controller with Create, Read, Update, and Delete (CRUD) functions** named `Books`.
For the remainder of the questions, you can accept the defaults by
hitting _Enter_. The terminal should look as follows:

```Bash
? Controller class name: Books
Controller Books will be created in src/controllers/books.controller.ts

? What kind of controller would you like to generate? REST Controller with CRUD functions
? What is the name of the model to use with this CRUD repository? Book
? What is the name of your CRUD repository? BookRepository
? What is the name of ID property? id
? What is the type of your ID? number
? Is the id omitted when creating a new instance? Yes
? What is the base HTTP path name of the CRUD operations? /books
   create src/controllers/books.controller.ts

No change to package.json was detected. No package manager install will be executed.
   update src/controllers/index.ts

Controller Books was/were created in src/controllers
```

Start the application with `$ npm start` and navigate to <http://localhost:3000/explorer/>.
This will open up the LoopBack API explorer that we can use to test our API.
Observe that the routes for various HTTP verbs have been automatically generated for us.

Navigate to the HTTP POST route in the explorer. Clicking the **Try it out** button will open
an interface where you will be able to add a book to the inventory. Change the sample `title`
and `author` values and then click **Execute**.

Navigate to <http://localhost:3000/books>. This route will return a JSON array of all
of the books stored. Expect to see the book that we added in the previous step:
`[{"id":1,"title":"Watership Down","author":"Richard Adams"}]`

We’ve generated a RESTful API that represents a bookstore inventory using the LoopBack CLI.

### How it works…

Here demonstrated how to build a RESTful API for a sample bookstore inventory.

The first command we supplied to the generator was `$ lb4 loopback-bookstore`. This
command scaffolds a LoopBack project structure for our application. We enabled all
the following optional features:

- `ESLint`: A popular linter with some pre-defined linter rules

- `Prettier`: A popular code formatter that is used throughout the examples in this book

- `Mocha`: A Node.js test framework

- `Loopback` Build: A set of LoopBack build helpers, exposed via the `@loopback/build` module

- `VSCode`: Configuration files for the VSCode editor

- `Docker`: Generates `Dockerfile` and `.dockerignore` for the application

- `Repositories`: Enables convenience methods that can automatically bind repository classes

- `Services`: Includes service-proxy imports (refer to <https://loopback.io/doc/en/lb4/Service.html>
  for more information on services)

Once the optional features were selected, the LoopBack CLI generated a base application structure.
This structure includes directories and files related to the optional features that were selected. For
example, the `eslintrc.js` and `mocharc.js` files were generated to configure ESLint and Mocha.

We used the LoopBack model generator to create representations of the data we needed to store. In
our case, we created one model named `Book` that contained the data we wished to store for each
book. The LoopBack generator assisted us in adding these properties, including specifying which type
the properties should be and whether they are required or optional properties. In larger and more
complex APIs, it’s common to have multiple models, where some models may reference others, in a
comparable manner to how relational databases are structured.

The model generator created our `Book` model in `src/models/book.model.ts`. The model file
contains a representation of a book in the form of a TypeScript class.

After creating the model, we used the LoopBack data source generator to create a data source. We
opted to use an in-memory data source to avoid the need to provision an instance of a database. Using
an in-memory data source means that by default, when we stop our API from running, the data is
lost. LoopBack handles data source integrations, removing the need for the developer to create and
set up the data store connection. For the most part, this means the developer will not need to write
code that is specific to the data store, making it easier to change between data stores.

With LoopBack 4, it is necessary to create a repository for our **Book** model. A repository acts as an
interface to a model, providing strong-typed data operations.

The final step of the recipe involved generating a controller to handle API requests and responses.
We instructed the generator to create a REST Controller with CRUD functions for the `Book` model.
**CRUD** covers the four basic functions that enable persistent storage.

The `Book` controller was created at `src/controllers/books.controller.ts` and contains
generated functions to handle each REST API operation for our `Book` model. For example, the
following code was generated in the controller to handle an HTTP GET request on the `/books`
route. This route returns all books in the data store:

```JavaScript
@get('/books', {
    responses: {
      '200': {
        description: 'Array of Book model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Book, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Book) filter?: Filter<Book>,
  ): Promise<Book[]> {
    return this.bookRepository.find(filter);
}
```

The controller, repositories, and data sources that were created are all loaded and bound to the
application at boot time. This is handled by the `@loopback/boot` module.

Then we used the API explorer (<http://localhost:3000/explorer/>)
to send requests to our API. The route explorer displays the available routes and provides sample
requests for each route, allowing for an intuitive way to test your API. This explorer is implemented
using Swagger UI (<https://swagger.io/>).

LoopBack also allows for the generation of an OpenAPI specification document for the API, providing
a standard interface for the RESTful API that includes human- and machine-readable definitions of
the API routes. This can be achieved by running the `npm run openapi-spec ./open-api.json`
command, which will create an `open-api.json` file containing the OpenAPI specification.

We highlighted that it is possible to generate a RESTful Node.js API without writing any code.
Once your base API has been generated, it would then be possible to extend the application with any
necessary business logic. LoopBack abstracts and handles some of the common technical tasks related
to creating APIs, such as implementing CRUD operations. This enables developers to focus on the
business logic of their microservice, rather than underlying and repetitive technical implementations.
