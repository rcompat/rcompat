# Contributing to rcompat

By contributing to rcompat, you agree that your contributions will be licensed
under its MIT license.

rcompat is a standard library for JavaScript runtimes, particularly Node, Deno
and Bun in their current versions.

## Scope

The project does not contain anything that WinterTC (Minimum Common Web
Platform API) already covers. [WinterTC][wintertc] is a proposal for a set of
interfaces that runtimes are expected to offer in the global scope
(`globalThis`).

Exceptions to this rule are justified in case one or more major runtimes fail
to properly implement or use WinterTC interfaces. For example, Node's
`http` module does not use proper `Request` objects in its servers.

## Setup

We recommend joining our Discord server at https://discord.gg/RSg4NNwM4f to
coordinate development. The rcompat channels are under the category `rcompat`.

Make sure you have Node, Deno and Bun installed in case you need to test
individual implementations. In addition, install PNPM as rcompat uses a
monorepo for development with the `workspace` protocol which isn't supported by
NPM.

## Build

To build the project, run `pnpm run build` in the root directory. You can also
build individual packages in their respective directories.

## Test

To test the project, run `pnpm run test` in the root directory. You can also
test individual packages in their respective directories.

## Lint

To test the project, run `pnpm run lint` in the root directory. You can also
test individual packages in their respective directories.

## Coding style

* Avoid camel case for variable names that are not part of the API surface
* One class / object / type for file, unless the supporting code is only used
once
* If you need helper functions, consider using existing helpers from other
rcompat packages or creating the helper function in a proper package

## Package layout

Packages maintain a separation of private and public code.

Private code should be scoped to the package only and imported within the
package with a hash (`#`) import defined in `package.json`'s `imports` field.
In particular, packages should not use relative imports as these break easily.

Public code represents the API surface and should contain individual files 
reexporting private code and no meaningful code.

## Diverging paths

In case a package needs to use different code paths to discriminate between
individual runtimes, use a [runtime key][runtime-keys].

## Dependencies

rcompat should ideally have no dependencies. In the few cases it has
dependencies, they are slated for removal or considered too much of an effort
to implement non-natively. Consult chat before adding any new dependencies.

[runtime-keys]: https://runtime-keys.proposal.wintercg.org
[wintertc]: https://min-common-api.proposal.wintertc.org
