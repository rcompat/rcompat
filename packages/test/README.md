# @rcompat/test

Testing library for JavaScript runtimes.

## What is @rcompat/test?

A cross-runtime testing library with a fluent assertion API. Provides deep
equality checks, type assertions, exception testing, and fetch interception.
Designed to work with the `proby` test runner. Works consistently across
Node, Deno, and Bun.

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
  // runs after all tests in this file
  await closeDatabase();
});
```

### Intercepting fetch

Use `test.intercept` to block outbound fetch calls to a specific origin and
replace them with fake responses. Calls to other origins pass through
untouched. The intercept records every request so you can assert on what was
called and how.

```js
import test from "@rcompat/test";

await using telegram = test.intercept("https://api.telegram.org", setup => {
  setup.post("/sendMessage", () => ({
    ok: true,
    result: { message_id: 42 },
  }));
});

test.case("notifies user via telegram on signup", async assert => {
  await fetch("http://localhost:6161/signup", {
    method: "POST",
    body: JSON.stringify({ email: "foo@bar.com" }),
  });

  // assert the path was hit the right number of times
  assert(telegram.calls("/sendMessage")).equals(1);

  // assert on the actual request that came in
  assert(telegram.requests("/sendMessage")[0].method).equals("POST");
});
```

`await using` restores the original fetch automatically when the file scope
exits. For long-lived intercepts that need manual control, use `restore()`
with `test.ended`:

```js
const telegram = test.intercept("https://api.telegram.org", setup => {
  setup.post("/sendMessage", () => ({ ok: true, result: { message_id: 42 } }));
});

test.case("first case", async assert => {
  // ...
});

test.case("second case", async assert => {
  // ...
});

test.ended(() => telegram.restore());
```

Hitting a path on an intercepted origin that has no registered handler throws
immediately, catching accidental unhandled calls early.

### Extending the asserter

Use `test.extend` to attach custom assertion methods to the asserter. Useful
for domain-specific assertions shared across many test cases.

```js
import test from "@rcompat/test";

// create an extended test with custom assertions
const myTest = test.extend((assert, subject) => ({
  even() {
    const passed = subject % 2 === 0;
    // use the base asserter to report the result
    assert(passed).true();
    return this;
  },
}));

myTest.case("even numbers", assert => {
  assert(2).even();
  assert(4).even();
});
```

The factory receives the base `assert` function and the current `subject`
(the value passed to `assert()`). Return an object whose methods will be
mixed into every `Assert` instance for that test.

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

### `test.intercept`

```ts
test.intercept(
  base_url: string,
  setup: (setup: Setup) => void
): Intercept;
```

Intercept outbound fetch calls to `base_url`. Returns an `Intercept` object
for asserting on recorded requests.

| Parameter  | Type       | Description                                      |
| ---------- | ---------- | ------------------------------------------------ |
| `base_url` | `string`   | Origin to intercept, e.g. `"https://api.example.com"` |
| `setup`    | `function` | Register route handlers on the setup object      |

#### `Setup`

| Method                          | Description                  |
| ------------------------------- | ---------------------------- |
| `get(path, handler)`            | Register a GET handler       |
| `post(path, handler)`           | Register a POST handler      |
| `put(path, handler)`            | Register a PUT handler       |
| `patch(path, handler)`          | Register a PATCH handler     |
| `delete(path, handler)`         | Register a DELETE handler    |

Each handler receives the incoming `Request` and returns a plain object,
which is serialized into a `Response` automatically.

#### `Intercept`

| Method              | Description                                          |
| ------------------- | ---------------------------------------------------- |
| `calls(path)`       | Number of times `path` was hit                       |
| `requests(path)`    | Array of `Request` objects recorded for `path`       |
| `restore()`         | Reinstate the original `globalThis.fetch`            |
| `[Symbol.asyncDispose]` | Called automatically by `await using`            |

### `test.extend`

```ts
test.extend<Subject, Extensions>(
  factory: (assert: Asserter, subject: Subject) => Extensions
): ExtendedTest<Extensions>;
```

Create a new test object with custom assertion methods mixed into the
asserter.

| Parameter | Type       | Description                                              |
| --------- | ---------- | -------------------------------------------------------- |
| `factory` | `function` | Returns extra methods to attach to each `Assert` instance |

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
| `includes(expected)`    | Inclusion check (string, array, object)   |
| `true()`                | Assert value is `true`                    |
| `false()`               | Assert value is `false`                   |
| `null()`                | Assert value is `null`                    |
| `undefined()`           | Assert value is `undefined`               |
| `defined()`             | Assert value is not `undefined`           |
| `instance(constructor)` | Assert value is instance of class         |
| `throws(expected?)`     | Assert function throws                    |
| `tries()`               | Assert function does not throw            |
| `not`                   | Negate the next assertion                 |
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
  add(n) { this.#value += n; return this; }
  subtract(n) { this.#value -= n; return this; }
  get value() { return this.#value; }
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

### Testing code that calls external APIs

```js
import test from "@rcompat/test";

await using openai = test.intercept("https://api.openai.com", setup => {
  setup.post("/v1/chat/completions", () => ({
    choices: [{ message: { content: "Hello!" } }],
  }));
});

test.case("generates a reply", async assert => {
  const reply = await myService.generateReply("hi");
  assert(reply).equals("Hello!");
  assert(openai.calls("/v1/chat/completions")).equals(1);
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

