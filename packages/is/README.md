# @rcompat/is

Type guard predicates for JavaScript runtimes.

## What is @rcompat/is?

A cross-runtime module providing type guard functions for common value checks.
All functions return boolean and include TypeScript type narrowing. Works
consistently across Node, Deno, and Bun.

## Installation

```bash
npm install @rcompat/is
```

```bash
pnpm add @rcompat/is
```

```bash
yarn add @rcompat/is
```

```bash
bun add @rcompat/is
```

## Usage

### nullish

Checks if a value is `null` or `undefined`.

```js
import is from "@rcompat/is";

is.nullish(null);      // true
is.nullish(undefined); // true
is.nullish(0);         // false
is.nullish("");        // false
is.nullish(false);     // false
```

### defined

Checks if a value is not `undefined`.

```js
import is from "@rcompat/is";

is.defined("hello");   // true
is.defined(0);         // true
is.defined(null);      // true
is.defined(undefined); // false
```

### truthy

Checks if a value is truthy.

```js
import is from "@rcompat/is";

is.truthy(1);       // true
is.truthy("hello"); // true
is.truthy([]);      // true
is.truthy(0);       // false
is.truthy("");      // false
is.truthy(null);    // false
```

### falsy

Checks if a value is falsy.

```js
import is from "@rcompat/is";

is.falsy(0);         // true
is.falsy("");        // true
is.falsy(null);      // true
is.falsy(undefined); // true
is.falsy(false);     // true
is.falsy(NaN);       // true
is.falsy(1);         // false
```

### empty

Checks if a value is empty (strings, arrays, Sets, Maps, objects).

```js
import is from "@rcompat/is";

is.empty("");        // true
is.empty([]);        // true
is.empty({});        // true
is.empty(new Set()); // true
is.empty(new Map()); // true
is.empty("hello");   // false
is.empty([1, 2]);    // false
is.empty({ a: 1 });  // false
```

### blank

Checks if a string is empty or contains only whitespace.

```js
import is from "@rcompat/is";

is.blank("");      // true
is.blank("   ");   // true
is.blank("\t\n");  // true
is.blank("hello"); // false
is.blank(" hi ");  // false
```

### numeric

Checks if a string represents a valid number.

```js
import is from "@rcompat/is";

is.numeric("123");    // true
is.numeric("-45.67"); // true
is.numeric("1e10");   // true
is.numeric("+3.14");  // true
is.numeric("abc");    // false
is.numeric("");       // false
is.numeric("12px");   // false
```

### int

Checks if a value is an integer number.

```js
import is from "@rcompat/is";

is.int(42);   // true
is.int(-10);  // true
is.int(0);    // true
is.int(3.14); // false
is.int(NaN);  // false
is.int("42"); // false
```

### uint

Checks if a value is a positive integer (unsigned).

```js
import is from "@rcompat/is";

is.uint(1);    // true
is.uint(100);  // true
is.uint(0);    // false
is.uint(-1);   // false
is.uint(3.14); // false
```

### safeint

Checks if a value is a safe integer (within JavaScript's safe range).

```js
import is from "@rcompat/is";

is.safeint(42);                          // true
is.safeint(Number.MAX_SAFE_INTEGER);     // true
is.safeint(Number.MAX_SAFE_INTEGER + 1); // false
is.safeint(3.14);                        // false
```

### finite

Checks if a number or bigint is finite.

```js
import is from "@rcompat/is";

is.finite(42);        // true
is.finite(3.14);      // true
is.finite(100n);      // true (bigints are always finite)
is.finite(Infinity);  // false
is.finite(-Infinity); // false
is.finite(NaN);       // false
```

### nan

Checks if a value is `NaN`.

```js
import is from "@rcompat/is";

is.nan(NaN);            // true
is.nan(Number.NaN);     // true
is.nan(0 / 0);          // true
is.nan(42);             // false
is.nan("NaN");          // false
```

### primitive

Checks if a value is a primitive type.

```js
import is from "@rcompat/is";

is.primitive("hello");   // true
is.primitive(42);        // true
is.primitive(true);      // true
is.primitive(null);      // true
is.primitive(undefined); // true
is.primitive(Symbol());  // true
is.primitive(100n);      // true
is.primitive({});        // false
is.primitive([]);        // false
```

### dict

Checks if a value is a plain object (not array, Date, class instance, etc.).

```js
import is from "@rcompat/is";

is.dict({});                  // true
is.dict({ a: 1 });            // true
is.dict(Object.create(null)); // true
is.dict([]);                  // false
is.dict(new Date());          // false
is.dict(new Map());           // false
is.dict(null);                // false
```

### newable

Checks if a value is a constructor (can be called with `new`).

```js
import is from "@rcompat/is";

is.newable(class {});      // true
is.newable(function() {}); // true
is.newable(Date);          // true
is.newable(() => {});      // false (arrow functions)
is.newable({});            // false
```

### boolish

Checks if a value is the string `"true"` or `"false"`.

```js
import is from "@rcompat/is";

is.boolish("true");  // true
is.boolish("false"); // true
is.boolish(true);    // false (not a string)
is.boolish("yes");   // false
is.boolish("1");     // false
```

## API Reference

All functions follow the same pattern:

```ts
declare function is<Name>(value: unknown): value is <Type>;
```

| Function      | Type Guard          | Description                    |
|---------------|---------------------|--------------------------------|
| `nullish`     | `null \| undefined` | `null` or `undefined`          |
| `defined`     | `unknown`           | not `undefined`                |
| `truthy`      | `unknown`           | `true` in boolean contexts     |
| `falsy`       | `unknown`           | `false` in boolean contexts    |
| `empty`       | `unknown`           | empty collection/string/object |
| `blank`       | `string`            | empty/whitespace string        |
| `numeric`     | `string`            | numeric string                 |
| `int`         | `number`            | integer number                 |
| `uint`        | `number \| bigint`  | unsigned (positive) integer    |
| `safeint`     | `number`            | safe integer                   |
| `finite`      | `number \| bigint`  | finite number                  |
| `nan`         | `number`            | `NaN`                          |
| `primitive`   | `Primitive`         | primitive type                 |
| `dict`        | `Dict`              | plain object                   |
| `newable`     | `Newable`           | constructor                    |
| `boolish`     | `"true" \| "false"` | boolean string                 |

## Examples

### Filter valid values

```js
import is from "@rcompat/is";

const values = [1, null, 2, undefined, 3];

values.filter(is.defined);     // [1, null, 2, 3]
values.filter(v => !is.nullish(v));  // [1, 2, 3]
```

### Parse configuration

```js
import is from "@rcompat/is";

function parseEnvVar(value) {
  if (is.boolish(value)) return value === "true";
  if (is.numeric(value)) return Number(value);
  return value;
}

parseEnvVar("true");   // true
parseEnvVar("42");     // 42
parseEnvVar("hello");  // "hello"
```

### Validate input

```js
import is from "@rcompat/is";

function validateForm(data) {
  const errors = [];

  if (is.blank(data.name)) {
    errors.push("Name is required");
  }

  if (!uint(data.age)) {
    errors.push("Age must be a positive integer");
  }

  return errors;
}
```

### Type-safe guards

```js
import is from "@rcompat/is";

function process(value) {
  if (is.primitive(value)) {
    // TypeScript knows: value is:
    // string | number | boolean | bigint | symbol | null | undefined
    return String(value);
  }

  if (is.dict(value)) {
    // TypeScript knows: value is Record<string, unknown>
    return JSON.stringify(value);
  }

  return "[complex object]";
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

