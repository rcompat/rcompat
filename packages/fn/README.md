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

transform({ name: "Bob" });  // { name: "Bob" }
transform({ name: "Bob" }, x => ({ ...x, id: 1 }));  // { name: "Bob", id: 1 }
```

### async.map

Parallel async map over an array using `Promise.all`. Maps all items
concurrently and waits for all to complete.

```js
import fn from "@rcompat/fn";

const urls = ["/api/users/1", "/api/users/2", "/api/users/3"];

// fetch all users in parallel
const users = await fn.async.map(urls, async (url) => {
  const response = await fetch(url);
  return response.json();
});
// [{ id: 1, ... }, { id: 2, ... }, { id: 3, ... }]
```

```js
import fn from "@rcompat/fn";

// with index parameter
const results = await fn.async.map([10, 20, 30], async (value, index) => {
  return { index, doubled: value * 2 };
});
// [{ index: 0, doubled: 20 }, { index: 1, doubled: 40 }, { index: 2, doubled: 60 }]
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

### `async.map(array, mapper)`

```ts
declare function map<T, U>(
  array: T[],
  mapper: (item: T, index: number, array: T[]) => Promise<U>
): Promise<U[]>;
```

Maps an array with an async function, executing all operations in parallel.

| Parameter | Type                                                 | Description            |
| --------- | ---------------------------------------------------- | ---------------------- |
| `array`   | `T[]`                                                | The array to map over  |
| `mapper`  | `(item: T, index: number, array: T[]) => Promise<U>` | Async mapping function |

**Returns**: A promise that resolves to an array of mapped values.

## Examples

### Filter undefined from array

```js
import fn from "@rcompat/fn";

const users = [
  { name: "John" },
  undefined,
  { name: "Bob" },
  undefined,
];

users.filter(fn.defined);
// [{ name: "John" }, { name: "Bob" }]
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

// use with default (no-op) transformations
processData(myData);

// use with custom transformations
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

### Parallel API requests

```js
import fn from "@rcompat/fn";

async function products(ids) {
  return fn.async.map(ids, async id => {
    const response = await fetch(`/api/products/${id}`);
    return response.json();
  });
}

const products = await products([1, 2, 3, 4, 5]);

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

