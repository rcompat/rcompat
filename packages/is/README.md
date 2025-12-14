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
import nullish from "@rcompat/is/nullish";

nullish(null);       // true
nullish(undefined);  // true
nullish(0);          // false
nullish("");         // false
nullish(false);      // false
```

### defined

Checks if a value is not `undefined`.

```js
import defined from "@rcompat/is/defined";

defined("hello");    // true
defined(0);          // true
defined(null);       // true
defined(undefined);  // false
```

### truthy

Checks if a value is truthy.

```js
import truthy from "@rcompat/is/truthy";

truthy(1);           // true
truthy("hello");     // true
truthy([]);          // true
truthy(0);           // false
truthy("");          // false
truthy(null);        // false
```

### falsy

Checks if a value is falsy.

```js
import falsy from "@rcompat/is/falsy";

falsy(0);            // true
falsy("");           // true
falsy(null);         // true
falsy(undefined);    // true
falsy(false);        // true
falsy(NaN);          // true
falsy(1);            // false
```

### empty

Checks if a value is empty (strings, arrays, Sets, Maps, objects).

```js
import empty from "@rcompat/is/empty";

empty("");           // true
empty([]);           // true
empty({});           // true
empty(new Set());    // true
empty(new Map());    // true
empty("hello");      // false
empty([1, 2]);       // false
empty({ a: 1 });     // false
```

### blank

Checks if a string is empty or contains only whitespace.

```js
import blank from "@rcompat/is/blank";

blank("");           // true
blank("   ");        // true
blank("\t\n");       // true
blank("hello");      // false
blank(" hi ");       // false
```

### numeric

Checks if a string represents a valid number.

```js
import numeric from "@rcompat/is/numeric";

numeric("123");      // true
numeric("-45.67");   // true
numeric("1e10");     // true
numeric("+3.14");    // true
numeric("abc");      // false
numeric("");         // false
numeric("12px");     // false
```

### integer

Checks if a value is an integer number.

```js
import integer from "@rcompat/is/integer";

integer(42);         // true
integer(-10);        // true
integer(0);          // true
integer(3.14);       // false
integer(NaN);        // false
integer("42");       // false
```

### uint

Checks if a value is a positive integer (unsigned).

```js
import uint from "@rcompat/is/uint";

uint(1);             // true
uint(100);           // true
uint(0);             // false
uint(-1);            // false
uint(3.14);          // false
```

### safeInteger

Checks if a value is a safe integer (within JavaScript's safe range).

```js
import safeInteger from "@rcompat/is/safe-integer";

safeInteger(42);                          // true
safeInteger(Number.MAX_SAFE_INTEGER);     // true
safeInteger(Number.MAX_SAFE_INTEGER + 1); // false
safeInteger(3.14);                        // false
```

### finite

Checks if a number or bigint is finite.

```js
import finite from "@rcompat/is/finite";

finite(42);          // true
finite(3.14);        // true
finite(100n);        // true (bigints are always finite)
finite(Infinity);    // false
finite(-Infinity);   // false
finite(NaN);         // false
```

### nan

Checks if a value is `NaN`.

```js
import nan from "@rcompat/is/nan";

nan(NaN);            // true
nan(Number.NaN);     // true
nan(0 / 0);          // true
nan(42);             // false
nan("NaN");          // false
```

### primitive

Checks if a value is a primitive type.

```js
import primitive from "@rcompat/is/primitive";

primitive("hello");  // true
primitive(42);       // true
primitive(true);     // true
primitive(null);     // true
primitive(undefined);// true
primitive(Symbol()); // true
primitive(100n);     // true
primitive({});       // false
primitive([]);       // false
```

### dict

Checks if a value is a plain object (not array, Date, class instance, etc.).

```js
import dict from "@rcompat/is/dict";

dict({});                    // true
dict({ a: 1 });              // true
dict(Object.create(null));   // true
dict([]);                    // false
dict(new Date());            // false
dict(new Map());             // false
dict(null);                  // false
```

### newable

Checks if a value is a constructor (can be called with `new`).

```js
import newable from "@rcompat/is/newable";

newable(class {});           // true
newable(function() {});      // true
newable(Date);               // true
newable(() => {});           // false (arrow functions)
newable({});                 // false
```

### boolish

Checks if a value is the string `"true"` or `"false"`.

```js
import boolish from "@rcompat/is/boolish";

boolish("true");     // true
boolish("false");    // true
boolish(true);       // false (not a string)
boolish("yes");      // false
boolish("1");        // false
```

## API Reference

All functions follow the same pattern:

```ts
declare function is<Name>(value: unknown): value is <Type>;
```

| Function      | Import Path               | Type Guard            | Description                        |
|---------------|---------------------------|-----------------------|------------------------------------|
| `nullish`     | `@rcompat/is/nullish`     | `null \| undefined`   | Is null or undefined               |
| `defined`     | `@rcompat/is/defined`     | `unknown`             | Is not undefined                   |
| `truthy`      | `@rcompat/is/truthy`      | `unknown`             | Is truthy value                    |
| `falsy`       | `@rcompat/is/falsy`       | `unknown`             | Is falsy value                     |
| `empty`       | `@rcompat/is/empty`       | `unknown`             | Is empty collection/string/object  |
| `blank`       | `@rcompat/is/blank`       | `string`              | Is empty/whitespace string         |
| `numeric`     | `@rcompat/is/numeric`     | `string`              | Is numeric string                  |
| `integer`     | `@rcompat/is/integer`     | `number`              | Is integer number                  |
| `uint`        | `@rcompat/is/uint`        | `number \| bigint`    | Is positive integer                |
| `safeInteger` | `@rcompat/is/safe-integer`| `number`              | Is safe integer                    |
| `finite`      | `@rcompat/is/finite`      | `number \| bigint`    | Is finite number                   |
| `nan`         | `@rcompat/is/nan`         | `number`              | Is NaN                             |
| `primitive`   | `@rcompat/is/primitive`   | `Primitive`           | Is primitive type                  |
| `dict`        | `@rcompat/is/dict`        | `Dict`                | Is plain object                    |
| `newable`     | `@rcompat/is/newable`     | `Newable`             | Is constructor                     |
| `boolish`     | `@rcompat/is/boolish`     | `"true" \| "false"`   | Is boolean string                  |

## Examples

### Filter valid values

```js
import defined from "@rcompat/is/defined";
import nullish from "@rcompat/is/nullish";

const values = [1, null, 2, undefined, 3];

values.filter(defined);     // [1, null, 2, 3]
values.filter(v => !nullish(v));  // [1, 2, 3]
```

### Parse configuration

```js
import boolish from "@rcompat/is/boolish";
import numeric from "@rcompat/is/numeric";

function parseEnvVar(value) {
  if (boolish(value)) {
    return value === "true";
  }
  if (numeric(value)) {
    return Number(value);
  }
  return value;
}

parseEnvVar("true");   // true
parseEnvVar("42");     // 42
parseEnvVar("hello");  // "hello"
```

### Validate input

```js
import blank from "@rcompat/is/blank";
import integer from "@rcompat/is/integer";
import uint from "@rcompat/is/uint";

function validateForm(data) {
  const errors = [];
  
  if (blank(data.name)) {
    errors.push("Name is required");
  }
  
  if (!integer(data.age) || !uint(data.age)) {
    errors.push("Age must be a positive integer");
  }
  
  return errors;
}
```

### Type-safe guards

```js
import dict from "@rcompat/is/dict";
import primitive from "@rcompat/is/primitive";

function process(value) {
  if (primitive(value)) {
    // TypeScript knows: value is string | number | boolean | bigint | symbol | null | undefined
    return String(value);
  }
  
  if (dict(value)) {
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

