# Configuring Continuous Integration tests

CI is a development practice where developers regularly merge their code to a source repository. To
maintain the integrity of the source code, automated tests will often be run before each code change
is accepted.

GitHub is one of the most widely used source code repository hosts. With GitHub, when you wish to
merge a change into the main Git branch or repository, you open a **pull request (PR)**. GitHub provides
features for you to configure checks that should run on each PR. It’s common, and good practice, to
require a PR to have a passing run of the application’s or module’s unit tests before it can be accepted.

There are many CI products that can enable the execution of your unit tests (GitHub Actions, Travis
CI, and many others). Most of these programs come with a limited free tier for casual developers and
paid commercial plans for businesses and enterprises.

## How it works…

In the GitHub Actions workflow configuration for a Node.js application, we outlined a specific CI
process designed to automate testing upon commits and PRs to the main branch. Here’s a detailed
breakdown of how the workflow functions, illustrated with code snippets from the `test.yml` file.

The workflow starts with the definition of event triggers under the on key in the YAML file. It is set
to activate on `push` and `pull_request` events specifically targeting the `main` branch:

```Yaml
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
```

This snippet ensures that any code pushed to `main` or any PRs made to `main` will initiate the CI process.

Next, we define the job environment and specify the Node.js versions to test against using a matrix
strategy. This approach allows testing across multiple versions, enhancing compatibility verification:

```Yaml
jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [20.x, 22.x]
```

The `runs-on: ubuntu-latest` step specifies that the job should run on the latest available version
of Ubuntu. The `matrix.node-version` is initially set to test on Node.js 20, but it’s extended to
also include Node.js 22, demonstrating how easily additional versions can be incorporated into the
testing strategy.

Following the environment setup, the workflow includes steps to check out the code, setup Node.js,
install dependencies, and run tests:

```Yaml
    steps:
    - uses: actions/checkout@v4
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
    - run: node --test
```

The `actions/checkout@v4` step checks out the repository contents into the GitHub Actions
runner, allowing the workflow to access the code. The `actions/setup-node@v4` step configures
the runner to use a specific version of Node.js as defined by the matrix.

By integrating these steps, the GitHub Actions workflow automates the testing process, ensuring that
all new code integrated into the main branch has passed through a rigorous testing process. This not
only ensures code quality but also helps in identifying issues early in the development cycle, making
it easier to manage and fix them.

**GitHub branch protection:**
It’s possible to configure GitHub to block PRs until they have a passing build/CI run. This can
be configured in the settings of your GitHub repository. For information on how to configure
branch protection, refer to
<https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches>.

GitHub Actions, as with the alternative CI providers, offers a powerful and flexible platform for
automating workflows across a wide range of development tasks. While this tutorial focused on setting
up a CI workflow for a typical Node.js application, the scope of GitHub Actions extends far beyond
this, allowing for a multitude of complex workflows.
