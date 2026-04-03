# proby

Test runner for JavaScript runtimes.

## What is proby?

A cross-runtime test runner that automatically discovers and runs test files.
Works with both single repositories and monorepos. Supports TypeScript source
execution in monorepos without a build step when your packages expose `source`
entries in `package.json`. Uses `@rcompat/test` for writing tests. Works
consistently across Node, Deno, and Bun.

## Installation

```bash
npm install proby
```

```bash
pnpm add proby
```

```bash
yarn add proby
```

```bash
bun add proby
```

You also need to install `@rcompat/test` as a peer dependency:

```bash
npm install @rcompat/test
```

## Usage

### Running tests

Run proby from your project root:

```bash
npx proby
```

Run a single file:

```bash
npx proby math.spec.ts
```

Run a single group within a file:

```bash
npx proby math.spec.ts addition
```

## How proby resolves source files

Proby relaunches itself with runtime conditions before running tests. By
default it uses the `source` condition, which lets runtimes resolve package
`imports` and `exports` to your TypeScript source files instead of built
JavaScript.

This is especially useful in monorepos where packages depend on each other and
you want to run tests against source directly.

To use this pattern, expose `source` entries in your packages.

Example:

```json
{
  "imports": {
    "#*": {
      "source": "./src/*.ts",
      "default": "./lib/*.js"
    }
  },
  "exports": {
    ".": {
      "source": "./src/index.ts",
      "default": "./lib/index.js"
    }
  }
}
```

With this setup, proby can run against your TypeScript source without requiring
an upfront build step.

## Configuration

Create `proby.config.ts` or `proby.config.js` in your project root.

```ts
import config from "proby/config";

export default config({
  monorepo: true,
  packages: "packages",
  include: ["src"],
  conditions: ["source"],
});
```

### Config options

#### `monorepo`

```ts
boolean
```

Whether proby should scan package directories inside a monorepo.

Default:

```ts
false
```

#### `packages`

```ts
string
```

Directory containing package folders when `monorepo` is enabled.

Default:

```ts
"packages"
```

#### `include`

```ts
string[]
```

Directories to scan for spec files.

Default:

```ts
["src"]
```

#### `conditions`

```ts
string[]
```

Runtime conditions used when proby relaunches itself.

Default:

```ts
["source"]
```

## Project structure

Proby automatically detects your project structure.

### Single repository

```text
my-project/
├── src/
│   ├── utils.ts
│   ├── utils.spec.ts
│   ├── math.ts
│   └── math.spec.ts
└── package.json
```

### Monorepo

```text
my-monorepo/
├── packages/
│   ├── core/
│   │   └── src/
│   │       ├── index.ts
│   │       └── index.spec.ts
│   └── utils/
│       └── src/
│           ├── helpers.ts
│           └── helpers.spec.ts
└── package.json
```

## Test file conventions

- Files must end with `.spec.ts` or `.spec.js`
- Files must be in one of the configured include directories
- Use `@rcompat/test` to write tests
- Use `test.group` to organize cases into named groups targetable by proby

## Static mock files

Proby supports preloading sibling mock files before a spec file is evaluated.
This allows module mocks to be registered before the spec's static imports are
read.

Pair files by matching the spec extension exactly:

- `math.spec.ts` pairs with `math.mock.ts`
- `math.spec.js` pairs with `math.mock.js`

If a sibling mock file exists, proby loads it before the spec file.

Example:

```ts
// math.ts
export function add(a: number, b: number) {
  return a + b;
}
```

```ts
// math.mock.ts
import test from "@rcompat/test";

test.mock("./math.ts", () => ({
  add: (a: number, b: number) => 99,
}));
```

```ts
// math.spec.ts
import test from "@rcompat/test";
import { add } from "./math.ts";

test.case("uses the preloaded mock", assert => {
  assert(add(1, 2)).equals(99);
});
```

Static mocks are file-scoped. A mock loaded for one spec file does not leak
into later spec files.

## Grouping tests

Use `test.group` in your spec files to cluster related cases. Groups can then
be targeted individually when running proby.

```js
import test from "@rcompat/test";

test.group("addition", () => {
  test.case("integers", assert => {
    assert(1 + 1).equals(2);
  });
});

test.group("multiplication", () => {
  test.case("integers", assert => {
    assert(2 * 3).equals(6);
  });
});
```

```bash
npx proby math.spec.ts addition
```

## Writing tests

Create test files with `.spec.ts` or `.spec.js`:

```js
import test from "@rcompat/test";

test.case("addition", assert => {
  assert(1 + 1).equals(2);
  assert(2 + 2).equals(4);
});

test.case("multiplication", assert => {
  assert(2 * 3).equals(6);
  assert(4 * 5).equals(20);
});
```

## Test output

Proby displays colored output:

- Green `o` for passing tests
- Red `x` for failing tests

```text
oooooxoo
src/math.spec.ts division
  expected  5
  actual    4
```

## npm scripts

Add proby to your `package.json`:

```json
{
  "scripts": {
    "test": "npx proby"
  }
}
```

Then run:

```bash
npm test
```

## Examples

### Basic assertions

```js
import test from "@rcompat/test";

test.case("basic assertions", assert => {
  assert(value).equals(expected);
  assert(condition).true();
  assert(condition).false();
  assert(value).type<string>();
  assert(() => throwingFunction()).throws();
  assert(() => safeFunction()).tries();
});
```

### Async tests

```js
import test from "@rcompat/test";

test.case("async operations", async assert => {
  const result = await fetchData();
  assert(result.status).equals(200);
});
```

### Testing modules

```js
// src/calculator.ts
export function add(a, b) {
  return a + b;
}

// src/calculator.spec.ts
import test from "@rcompat/test";
import { add } from "./calculator.js";

test.case("add function", assert => {
  assert(add(1, 2)).equals(3);
  assert(add(-1, 1)).equals(0);
  assert(add(0, 0)).equals(0);
});
```

## Cross-Runtime Compatibility

| Runtime | Supported |
| ------- | --------- |
| Node.js | ✓         |
| Deno    | ✓         |
| Bun     | ✓         |

## License

MIT

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) in the repository root.

