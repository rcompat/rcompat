# @rcompat/array

Array utility functions for JavaScript runtimes.

## What is @rcompat/array?

A cross-runtime module providing common array operations that work consistently
across Node, Deno, and Bun. Includes functions for computing differences,
checking emptiness, and normalizing values to arrays.

## Installation

```bash
npm install @rcompat/array
```

## Usage

### difference

Returns elements from the first array that are not present in the second array
(set difference).

```js
import array from "@rcompat/array";

array.difference([1, 2, 3, 4], [2, 4]);
// [1, 3]

array.difference(["a", "b", "c"], ["b"]);
// ["a", "c"]

array.difference([1, 2], [1, 2]);
// []
```

### empty

Checks if an array is empty.

```js
import array from "@rcompat/array";

array.empty([]);
// true

array.empty(["foo"]);
// false

array.empty([[]]);
// false (contains one element, an empty array)
```

### to

Normalizes a value to an array. If the value is already an array, it is
returned as-is. Otherwise, the value is wrapped in an array.

```js
import array from "@rcompat/array";

array.to("hello");
// ["hello"]

array.to(["hello"]);
// ["hello"]

array.to(42);
// [42]

to([1, 2, 3]);
// [1, 2, 3]
```

## API Reference

### `difference(a, b)`

```ts
declare function difference(a: unknown[], b: unknown[]): unknown[];
```

Returns elements in `a` that are not in `b`.

| Parameter | Type        | Description                    |
|-----------|-------------|--------------------------------|
| `a`       | `unknown[]` | The source array               |
| `b`       | `unknown[]` | The array of elements to exclude |

**Returns**: A new array containing elements from `a` not found in `b`.

### `empty(array)`

```ts
declare function empty(array: unknown[]): boolean;
```

Checks whether an array has no elements.

| Parameter | Type        | Description          |
|-----------|-------------|----------------------|
| `array`   | `unknown[]` | The array to check   |

**Returns**: `true` if the array is empty, `false` otherwise.

### `to(value)`

```ts
declare function to<T>(value: T | T[]): T[];
```

Ensures a value is an array.

| Parameter | Type      | Description                |
|-----------|-----------|----------------------------|
| `value`   | `T \| T[]` | A value or array of values |

**Returns**: The value wrapped in an array, or the original array if already an array.

## Examples

### Processing user input

```js
import array from "@rcompat/array";

function processIds(ids) {
  const idArray = array.to(ids);

  if (array.empty(idArray)) {
    return "No IDs provided";
  }

  return `Processing ${idArray.length} ID(s)`;
}

processIds("user-1");        // "Processing 1 ID(s)"
processIds(["user-1", "user-2"]); // "Processing 2 ID(s)"
processIds([]);              // "No IDs provided"
```

### Finding new items

```js
import array from "@rcompat/array";

const previousTags = ["javascript", "typescript", "node"];
const currentTags = ["javascript", "typescript", "deno", "bun"];

const newTags = array.difference(currentTags, previousTags);
// ["deno", "bun"]

const removedTags = array.difference(previousTags, currentTags);
// ["node"]
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

See [HACKING.md](../../HACKING.md) in the repository root.

