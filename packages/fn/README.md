# @rcompat/fn

Function utilities for JavaScript runtimes.

## What is @rcompat/fn?

A cross-runtime module providing common function utilities for functional
programming patterns. Works consistently across Node, Deno, and Bun.

## Installation

```bash
npm install @rcompat/fn
```

```bash
pnpm add @rcompat/fn
```

```bash
yarn add @rcompat/fn
```

```bash
bun add @rcompat/fn
```

## Usage

### defined

A predicate function that checks if a value is not `undefined`.

```js
import fn from "@rcompat/fn";

fn.defined("hello");    // true
fn.defined(0);          // true
fn.defined(null);       // true
fn.defined(false);      // true
fn.defined(undefined);  // false
```

Useful for filtering out undefined values:

```js
import fn from "@rcompat/fn";

const values = [1, undefined, 2, undefined, 3];
const filtered = values.filter(fn.defined);
// [1, 2, 3]
```

### identity

The identity function — returns its input unchanged.

```js
import fn from "@rcompat/fn";

fn.identity(42);        // 42
fn.identity("hello");   // "hello"
fn.identity({ a: 1 });  // { a: 1 }
```

Useful as a default callback or no-op transformer:

```js
import fn from "@rcompat/fn";

function transform(data, transformer = fn.identity) {
  return transformer(data);
}

transform({ name: "Alice" });  // { name: "Alice" }
transform({ name: "Alice" }, x => ({ ...x, id: 1 }));  // { name: "Alice", id: 1 }
```

## API Reference

### `defined(value)`

```ts
declare function defined<T>(value: T): boolean;
```

Checks if a value is not `undefined`.

| Parameter | Type | Description         |
|-----------|------|---------------------|
| `value`   | `T`  | The value to check  |

**Returns**: `true` if the value is not `undefined`, `false` otherwise.

### `identity(value)`

```ts
declare function identity<T>(value: T): T;
```

Returns the input value unchanged.

| Parameter | Type | Description          |
|-----------|------|----------------------|
| `value`   | `T`  | The value to return  |

**Returns**: The same value that was passed in.

## Examples

### Filter undefined from array

```js
import fn from "@rcompat/fn";

const users = [
  { name: "Alice" },
  undefined,
  { name: "Bob" },
  undefined,
];

users.filter(fn.defined);
// [{ name: "Alice" }, { name: "Bob" }]
```

### Optional transformation pipeline

```js
import fn from "@rcompat/fn";

function processData(data, options = {}) {
  const {
    preProcess = fn.identity,
    postProcess = fn.identity,
  } = options;

  const prepared = preProcess(data);
  const result = doWork(prepared);
  return postProcess(result);
}

// Use with default (no-op) transformations
processData(myData);

// Use with custom transformations
processData(myData, {
  preProcess: data => data.map(x => x * 2),
  postProcess: result => result.filter(x => x > 10),
});
```

### Conditional mapping

```js
import fn from "@rcompat/fn";

function conditionalMap(array, condition, mapper) {
  return array.map(condition ? mapper : fn.identity);
}

const numbers = [1, 2, 3];

conditionalMap(numbers, true, x => x * 2);   // [2, 4, 6]
conditionalMap(numbers, false, x => x * 2);  // [1, 2, 3]
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

