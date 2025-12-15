# @rcompat/test

Testing library for JavaScript runtimes.

## What is @rcompat/test?

A cross-runtime testing library with a fluent assertion API. Provides deep
equality checks, type assertions, and exception testing. Designed to work
with the `proby` test runner. Works consistently across Node, Deno, and Bun.

## Installation

```bash
npm install @rcompat/test
```

```bash
pnpm add @rcompat/test
```

```bash
yarn add @rcompat/test
```

```bash
bun add @rcompat/test
```

## Usage

### Writing tests

Create a `.spec.ts` or `.spec.js` file:

```js
import test from "@rcompat/test";

test.case("addition works", assert => {
  assert(1 + 1).equals(2);
});

test.case("string concatenation", assert => {
  assert("hello" + " " + "world").equals("hello world");
});
```

### Running tests

Use the `proby` test runner:

```bash
npx proby
```

### Equality assertions

```js
import test from "@rcompat/test";

test.case("equals", assert => {
  // primitives
  assert(42).equals(42);
  assert("hello").equals("hello");
  assert(true).equals(true);

  // objects (deep equality)
  assert({ a: 1, b: 2 }).equals({ a: 1, b: 2 });
  assert([1, 2, 3]).equals([1, 2, 3]);

  // nested structures
  assert({ users: [{ name: "Alice" }] }).equals({
    users: [{ name: "Alice" }],
  });
});

test.case("nequals", assert => {
  assert(1).nequals(2);
  assert("foo").nequals("bar");
  assert({ a: 1 }).nequals({ a: 2 });
});
```

### Boolean assertions

```js
import test from "@rcompat/test";

test.case("boolean checks", assert => {
  assert(1 === 1).true();
  assert(1 === 2).false();
  assert(null).null();
  assert(undefined).undefined();
});
```

### Instance assertions

```js
import test from "@rcompat/test";

test.case("instanceof", assert => {
  assert(new Date()).instance(Date);
  assert(new Map()).instance(Map);
  assert([1, 2, 3]).instance(Array);
});
```

### Exception assertions

```js
import test from "@rcompat/test";

test.case("throws", assert => {
  // check that function throws
  assert(() => {
    throw new Error("oops");
  }).throws();

  // Check specific error message
  assert(() => {
    throw new Error("invalid input");
  }).throws("invalid input");
});

test.case("tries (does not throw)", assert => {
  assert(() => {
    return 42;
  }).tries();
});
```

### Type assertions

```js
import test from "@rcompat/test";

test.case("type checking", assert => {
  // compile-time type checks
  assert<string>().type<string>();
  assert("hello").type<string>();

  // check types don't match
  assert<string>().nottype<number>();
  assert(42).nottype<string>();

  // literal types
  assert<"foo">().type<"foo">();
  assert<"foo">().nottype<"bar">();
});
```

### Async tests

```js
import test from "@rcompat/test";

test.case("async operations", async assert => {
  const result = await Promise.resolve(42);
  assert(result).equals(42);
});

test.case("fetch data", async assert => {
  const response = await fetch("https://api.example.com/data");
  assert(response.ok).true();
});
```

### Cleanup with ended

```js
import test from "@rcompat/test";

test.case("database test", async assert => {
  const db = await openDatabase();
  const user = await db.createUser({ name: "Alice" });
  assert(user.name).equals("Alice");
});

test.ended(async () => {
  // cleanup after all tests in this file
  await closeDatabase();
});
```

## API Reference

### `test.case`

```ts
test.case(name: string, body: (assert: Asserter) => void | Promise<void>): void;
```

Define a test case.

| Parameter | Type       | Description                           |
| --------- | ---------- | ------------------------------------- |
| `name`    | `string`   | Test case name                        |
| `body`    | `function` | Test function receiving assert helper |

### `test.ended`

```ts
test.ended(callback: () => void | Promise<void>): void;
```

Register a cleanup callback to run after all tests in the file.

### `Asserter`

```ts
type Asserter = <T>(actual?: T) => Assert<T>;
```

The assert function passed to test cases.

### `Assert<T>`

| Method                  | Description                               |
| ----------------------- | ----------------------------------------- |
| `equals(expected)`      | Deep equality check                       |
| `nequals(expected)`     | Deep inequality check                     |
| `true()`                | Assert value is `true`                    |
| `false()`               | Assert value is `false`                   |
| `null()`                | Assert value is `null`                    |
| `undefined()`           | Assert value is `undefined`               |
| `instance(constructor)` | Assert value is instance of class         |
| `throws(message?)`      | Assert function throws (optional message) |
| `tries()`               | Assert function does not throw            |
| `type<T>()`             | Compile-time type assertion               |
| `nottype<T>()`          | Compile-time negative type assertion      |
| `pass()`                | Manually pass the assertion               |
| `fail(reason?)`         | Manually fail the assertion               |

### Utilities

#### `equals`

```ts
import equals from "@rcompat/test/equals";

equals(a: unknown, b: unknown): boolean;
```

Deep equality check supporting primitives, objects, arrays, maps, sets, dates.

#### `any`

```ts
import any from "@rcompat/test/any";

any(value: unknown): never;
```

Cast any value to `never` type for testing purposes.

#### `undef`

```ts
import undef from "@rcompat/test/undef";

const value: never = undef;
```

Pre-cast `undefined` value typed as `never`.

#### `E`

```ts
import E from "@rcompat/test/E";

E(error: unknown): { message: string };
```

Extract error message from unknown error type.

## Examples

### Testing a utility function

```js
// sum.ts
export default (a, b) => a + b;

// sum.spec.ts
import test from "@rcompat/test";
import sum from "./sum.js";

test.case("sum adds two numbers", assert => {
  assert(sum(1, 2)).equals(3);
  assert(sum(-1, 1)).equals(0);
  assert(sum(0, 0)).equals(0);
});
```

### Testing a class

```js
import test from "@rcompat/test";

class Calculator {
  #value = 0;
  add(n) {
    this.#value += n;
    return this;
  }
  subtract(n) {
    this.#value -= n;
    return this;
  }
  get value() {
    return this.#value;
  }
}

test.case("calculator operations", assert => {
  const calc = new Calculator();
  calc.add(10).subtract(3);
  assert(calc.value).equals(7);
});

test.case("calculator is instance", assert => {
  assert(new Calculator()).instance(Calculator);
});
```

### Testing error handling

```js
import test from "@rcompat/test";

function divide(a, b) {
  if (b === 0) throw new Error("Division by zero");
  return a / b;
}

test.case("divide throws on zero", assert => {
  assert(() => divide(10, 0)).throws("Division by zero");
});

test.case("divide works normally", assert => {
  assert(() => divide(10, 2)).tries();
  assert(divide(10, 2)).equals(5);
});
```

## Cross-Runtime Compatibility

| Runtime | Supported |
| ------- | --------- |
| Node.js | ✓         |
| Deno    | ✓         |
| Bun     | ✓         |

No configuration required — just import and use.

## License

MIT

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) in the repository root.
