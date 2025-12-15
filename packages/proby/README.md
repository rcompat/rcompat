# proby

Test runner for JavaScript runtimes.

## What is proby?

A cross-runtime test runner that automatically discovers and runs test files.
Works with both single repositories and monorepos. Uses `@rcompat/test` for
writing tests. Works consistently across Node, Deno, and Bun.

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

### Writing tests

Create test files with `.spec.ts` or `.spec.js` extension in your `src`
directory:

```js
// src/math.spec.ts
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

### Test output

Proby displays colored output:
- Green `o` for passing tests
- Red `x` for failing tests

```
oooooxoo
src/math.spec.ts division
  expected  5
  actual    4
```

### Project structure

Proby automatically detects your project structure:

**Single repository:**
```
my-project/
├── src/
│   ├── utils.ts
│   ├── utils.spec.ts    # ← Test file
│   ├── math.ts
│   └── math.spec.ts     # ← Test file
└── package.json
```

**Monorepo:**
```
my-monorepo/
├── packages/
│   ├── core/
│   │   └── src/
│   │       ├── index.ts
│   │       └── index.spec.ts  # ← Test file
│   └── utils/
│       └── src/
│           ├── helpers.ts
│           └── helpers.spec.ts  # ← Test file
└── package.json
```

### npm scripts

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

## Test file conventions

- Files must end with `.spec.ts` or `.spec.js`
- Files must be in the `src` directory (or `packages/*/src` for monorepos)
- Use `@rcompat/test` to write tests

## Examples

### Basic assertions

```js
import test from "@rcompat/test";

test.case("basic assertions", assert => {
  // equality
  assert(value).equals(expected);

  // truthiness
  assert(condition).true();
  assert(condition).false();

  // type checking
  assert(value).type<string>();

  // throws
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
export function add(a: number, b: number) {
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
|---------|-----------|
| Node.js | ✓         |
| Deno    | ✓         |
| Bun     | ✓         |

No configuration required — just run `npx proby`.

## License

MIT

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) in the repository root.

