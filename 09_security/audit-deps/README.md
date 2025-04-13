# Detecting dependency vulnerabilities

We’ve leveraged modules from the `npm` registry to form a foundation for the
applications we build. We’ve learned how the vast module ecosystem enables us to focus on application
logic and not have to reinvent common technical solutions repeatedly.

This ecosystem is key to Node.js’s success. However, it does lead to large, nested dependency trees within
our applications. Not only must we be concerned with the security of the application code that we write
ourselves, but we must also consider the security of the code included in the modules in our dependency
tree. Even the most mature and popular modules and frameworks may contain security vulnerabilities.

## How it works…

The `$ npm audit` command has been available since npm version 6. The command submits a
report of the dependencies in our application and compares it with a database of known vulnerabilities.
The `$ npm audit` command will audit direct, development, bundled, and optional dependencies.
However, it does not audit peer dependencies. The command requires both a `package.json` file
and a `package-lock.json` file to be present; otherwise, it will fail. The audit automatically runs
when a package is installed with the `$ npm install` command.

Many organizations consider `$ npm audit` to be a precautionary measure to protect their applications
against known security vulnerabilities. For this reason, it is common to add the `$ npm audit`
command to your **continuous integration (CI)** testing. The `$ npm audit` command reports an
error code of `1` when a vulnerability is found; this error code can be leveraged to indicate a failed test.

Here we used the `$ npm audit fix` command to automatically update our dependencies
to fixed versions. This command will only upgrade dependencies to later minor or patch versions.

Should a vulnerability only be fixed in a new major version, `npm` will output a warning indicating the
fix is available via `npm audit fix --force`.

Fixes that require updates to a new major release will not be automatically fixed by the `$ npm audit fix`
command as you may need to update your application code to accommodate the breaking change
in the dependency. It is possible to override this behavior and force `npm` to update all dependencies,
even if they include breaking changes, using the `$ npm audit fix --force` command. However,
in the case of a breaking change, it would be prudent to review the individual module vulnerabilities
and manually update the modules one at a time.

In some cases, a patched version of a dependency may not be available. In this case, `npm` will inform
you that a manual review is required. During this manual review, it’s worthwhile trying to determine
whether your application is susceptible to the vulnerability. Some vulnerabilities will only apply to the
use of certain APIs, so if you’re not using those APIs in your application, you may be able to discount the
specific vulnerability. If the vulnerability applies to your application and there’s no patched version of
the dependency available, you should consider patching it within your application’s node_modules,
if possible. A common approach to achieve this is using the `patch-package`
(<https://www.npmjs.com/package/patch-package>) module from npm.

**Important note:**
In general, it’s worthwhile keeping your application’s dependencies as up-to-date as possible to
ensure you have the latest available bugs and security fixes. Tools such as **Dependabot**
(<https://dependabot.com/>) can help keep your dependencies up to date by automating updates on GitHub.

Note that `npm audit` works by comparing your dependency tree against a database of known
vulnerabilities. Having `npm audit` return no known vulnerabilities doesn’t mean your dependencies
aren’t vulnerable – there could, and likely are, unreported or unknown vulnerabilities in your tree.
There are also commercial services that provide module dependency vulnerability auditing services.
Some of these, such as **Snyk** (<https://snyk.io/>), maintain their own weakness and vulnerability
databases, which may contain a different set of known issues to audit your dependencies against.

There are additional options available when using `npm audit` so that you can tailor it to your needs:

- `--audit-level <level>`: Allows you to specify the minimum vulnerability level that npm
  audit should report on. The levels include `info`, `low`, `moderate`, `high`, and `critical`.

- `--dry-run`: Simulates the action of fixing vulnerabilities without applying any changes.

- `--force`: Forces vulnerable dependencies to be updated, bypassing certain checks such
  as peer dependency compatibility. This option should be used with caution as it can lead to
  dependency conflicts or introduce breaking changes within your project.

- `--json`: Outputs the audit results in JSON format.

- `--package-lock-only`: Restricts the audit to project dependencies defined in the
  `package-lock.json` or `npm-shrinkwrap.json` files, without requiring an actual install.

- `--no-package-lock`: Ignores the project’s `package-lock.json` or `npm-shrinkwrap.json`
  files during the audit. This can be useful when you want to audit the state of the `node_modules` directory.

- `--omit` and `--include`: Allow you to configure which types of dependencies (development,
  optional, or peer dependencies) to exclude or include in the audit process, respectively.

## There’s more...

In addition to using `npm audit`, you can leverage GitHub’s Dependabot to enhance your project’s
security and keep your dependencies up to date. Dependabot automates the process of checking for
vulnerabilities and creating pull requests to update your dependencies. It continuously monitors your
project’s dependencies and alerts you if it detects any vulnerabilities. Dependabot can automatically
open pull requests to update outdated dependencies to their latest versions.

By integrating Dependabot with your GitHub repository, you can ensure that your project stays current
with the latest security patches and updates, reducing the risk of potential vulnerabilities. Please refer
to <https://docs.github.com/en/code-security/dependabot> for GitHub guidelines
on enabling and using Dependabot.

### See also

• The npm documentation for npm audit: <https://docs.npmjs.com/auditing-package-dependencies-for-security-vulnerabilities>
