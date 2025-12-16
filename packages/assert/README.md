# @rcompat/assert

Runtime type assertions and invariants.

## What is @rcompat/assert?

A cross-runtime module for runtime type checking and validation that works
consistently across Node, Deno, and Bun. Provides type assertions with helpful
error messages.

## Installation

```sh
npm install @rcompat/assert
```

## Usage

### Basic assertions

Validates a value against a type and throws with a helpful message if validation
fails.
```js
import assert from "@rcompat/assert";

// primitives
assert.bigint(x);
assert.boolean(x);
assert.function(x);
assert.number(x);
assert.string(x);
assert.symbol(x);
assert.undefined(x);

// conditions
assert.array(x);
assert.date(x);
assert.dict(x);    // plain object (not array, Date, class instance, etc.)
assert.error(x);
assert.false(x);
assert.finite(x);
assert.int(x);
assert.map(x);
assert.nan(x);
assert.newable(x);
assert.null(x);
assert.nullish(x);
assert.object(x);  // any non-null object
assert.promise(x);
assert.regexp(x);
assert.safeint(x);
assert.set(x);
assert.true(x);
assert.uint(x);    // unsigned (non-negative) integer
assert.url(x);

// other
assert.defined(x);
assert.instance(x, MyClass);
assert.uuid(x);    // valid UUIDv4 string (lowercase, crypto.randomUUID format)
```

### Custom error messages

```js
import assert from "@rcompat/assert";

assert.string(input, "Expected a string for username");
assert.number(input, () => new TypeError("Invalid count"));
```

### Instance checks

```js
import assert from "@rcompat/assert";

class Animal {}
class Dog extends Animal {}

const dog = new Dog();

assert.instance(dog, Animal);  // passes
assert.instance(dog, Dog);     // passes
assert.instance(dog, Map);     // throws
```

### maybe

Optional/nullable assertions. Returns without throwing for `null` or
`undefined`, but validates non-nullish values.

```js
import assert from "@rcompat/assert";

// returns without error for nullish
assert.maybe.string(undefined);  // ok
assert.maybe.number(null);       // ok

// validates non-nullish values
assert.maybe.string("hello");    // ok
assert.maybe.string(42);         // throws - 42 is not a string
```

### every

Ensures ALL values in an array satisfy a type condition.

```js
import assert from "@rcompat/assert";

assert.every.string(["a", "b", "c"]);  // ok - all strings
assert.every.number([1, 2, 3]);        // ok - all numbers
assert.every.number([1, "2", 3]);      // throws - "2" is not a number

assert.every.instance([dog1, dog2], Animal);  // ok - all Animal instances
```

## API Reference

### Primitives

| Method                | Description                    |
|-----------------------|--------------------------------|
| `assert.bigint(x)`    | Assert value is a bigint       |
| `assert.boolean(x)`   | Assert value is a boolean      |
| `assert.function(x)`  | Assert value is a function     |
| `assert.number(x)`    | Assert value is a number       |
| `assert.string(x)`    | Assert value is a string       |
| `assert.symbol(x)`    | Assert value is a symbol       |
| `assert.undefined(x)` | Assert value is undefined      |

### Conditions

| Method                | Description                              |
|-----------------------|------------------------------------------|
| `assert.array(x)`     | Assert value is an array                 |
| `assert.date(x)`      | Assert value is a `Date`                 |
| `assert.dict(x)`      | Assert value is a plain object           |
| `assert.error(x)`     | Assert value is an `Error`               |
| `assert.false(x)`     | Assert value is exactly `false`          |
| `assert.finite(x)`    | Assert value is a finite number          |
| `assert.int(x)`       | Assert value is an integer               |
| `assert.map(x)`       | Assert value is a `Map`                  |
| `assert.nan(x)`       | Assert value is `NaN`                    |
| `assert.newable(x)`   | Assert value is constructable            |
| `assert.null(x)`      | Assert value is exactly `null`           |
| `assert.nullish(x)`   | Assert value is `null` or `undefined`    |
| `assert.object(x)`    | Assert value is a non-null object        |
| `assert.promise(x)`   | Assert value is a `Promise`              |
| `assert.regexp(x)`    | Assert value is a `RegExp`               |
| `assert.safeint(x)`   | Assert value is a safe integer           |
| `assert.set(x)`       | Assert value is a `Set`                  |
| `assert.true(x)`      | Assert value is exactly `true`           |
| `assert.uint(x)`      | Assert value is an unsigned integer      |
| `assert.url(x)`       | Assert value is a `URL`                  |

### Other

| Method                     | Description                              |
|----------------------------|------------------------------------------|
| `assert.defined(x)`        | Assert value is not undefined            |
| `assert.instance(x, Ctor)` | Assert value is instance of Ctor         |
| `assert.uuid(x)`           | Assert value is a valid UUIDv4           |

### maybe

All assertions are available under `assert.maybe.*` for optional values:
```js
assert.maybe.string(x);
assert.maybe.number(x);
assert.maybe.instance(x, MyClass);
// ... etc
```

### every

All assertions are available under `assert.every.*` for array validation:
```js
assert.every.string(xs);
assert.every.number(xs);
assert.every.instance(xs, MyClass);
// ... etc
```

## Examples

### Validating function inputs

```js
import assert from "@rcompat/assert";

function createUser(data) {
  assert.dict(data);
  assert.string(data.name);
  assert.uint(data.age);
  assert.maybe.string(data.nickname);

  return { ...data };
}
```

### Parsing configuration

```js
import assert from "@rcompat/assert";

function parseConfig(config) {
  assert.dict(config);
  assert.uint(config.port);
  assert.string(config.host);
  assert.maybe.boolean(config.debug);

  return {
    port: config.port,
    host: config.host,
    debug: config.debug ?? false,
  };
}
```

### Validating arrays

```js
import assert from "@rcompat/assert";

function processIds(ids) {
  assert.array(ids);
  assert.every.uuid(ids);

  return ids.map(id => lookup(id));
}
```

## Cross-Runtime Compatibility

| Runtime | Supported |
|---------|-----------|
| Node.js | ✓         |
| Deno    | ✓         |
| Bun     | ✓         |

No configuration required — just import and use.

## License

MIT

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) in the repository root.
