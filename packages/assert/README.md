# @rcompat/assert

Runtime type assertions and invariants.

## What is @rcompat/assert?

A cross-runtime module for runtime type checking and validation that works
consistently across Node, Deno, and Bun. Provides chainable type assertions
with helpful error messages and TypeScript type narrowing.

## Installation

```bash
npm install @rcompat/assert
```

## Usage

### is

The main assertion function. Validates a value against a type and throws with
a helpful message if validation fails. Returns the value with narrowed type.

```js
import is from "@rcompat/assert/is";

// Basic type assertions
const name = is(input).string();    // throws if not a string
const count = is(input).number();   // throws if not a number
const flag = is(input).boolean();   // throws if not a boolean
const items = is(input).array();    // throws if not an array
const obj = is(input).object();     // throws if not a non-null object
```

```js
import is from "@rcompat/assert/is";

// Advanced type checks
is(value).record();     // plain object (not array, Date, class instance, etc.)
is(value).uuid();       // valid UUIDv4 string (lowercase, crypto.randomUUID format)
is(value).integer();    // integer number
is(value).usize();      // non-negative integer (unsigned)
is(value).defined();    // not undefined
is(value).null();       // exactly null
is(value).undefined();  // exactly undefined
is(value).true();       // exactly true
is(value).false();      // exactly false
is(value).newable();    // constructable class/function
```

```js
import is from "@rcompat/assert/is";

// Instance and subclass checks
class Animal {}
class Dog extends Animal {}

const dog = new Dog();

is(dog).instance(Animal);   // passes - dog is an instance of Animal
is(dog).instance(Dog);      // passes - dog is an instance of Dog
is(Dog).subclass(Animal);   // passes - Dog extends Animal

// Check against multiple classes
is(value).anyOf([String, Number, Array]);
```

```js
import is from "@rcompat/assert/is";

// Custom error messages
is(input).string("Expected a string for username");
is(input).number(() => new TypeError("Invalid count"));
```

### every

Ensures ALL values satisfy a type condition. Useful for validating arrays of
values.

```js
import every from "@rcompat/assert/every";

// Validate multiple values at once
const [a, b, c] = every(x, y, z).string();   // all must be strings
const nums = every(1, 2, 3).number();        // all must be numbers
const ids = every(...values).integer();      // all must be integers
```

### defined

Shorthand to ensure a value is not `undefined`.

```js
import defined from "@rcompat/assert/defined";

function greet(name) {
  defined(name);  // throws if name is undefined
  console.log(`Hello, ${name}!`);
}

// With custom error
defined(config.apiKey, "API key is required");
```

### maybe

Optional/nullable version of `is`. Returns `null` or `undefined` as-is without
throwing, but validates non-nullish values.

```js
import maybe from "@rcompat/assert/maybe";

// Returns undefined/null without error
maybe(undefined).string();  // returns undefined
maybe(null).number();       // returns null

// Validates non-nullish values
maybe("hello").string();    // returns "hello"
maybe(42).string();         // throws - 42 is not a string
```

## API Reference

### `is(value)`

```ts
declare function is(value: unknown): Is;
```

Creates an assertion chain for the given value.

| Parameter | Type      | Description         |
|-----------|-----------|---------------------|
| `value`   | `unknown` | The value to assert |

**Returns**: An `Is` instance with the following methods:

| Method                | Returns           | Description                              |
|-----------------------|-------------------|------------------------------------------|
| `.string(error?)`     | `string`          | Assert value is a string                 |
| `.number(error?)`     | `number`          | Assert value is a number                 |
| `.bigint(error?)`     | `bigint`          | Assert value is a bigint                 |
| `.boolean(error?)`    | `boolean`         | Assert value is a boolean                |
| `.symbol(error?)`     | `symbol`          | Assert value is a symbol                 |
| `.function(error?)`   | `Function`        | Assert value is a function               |
| `.array(error?)`      | `unknown[]`       | Assert value is an array                 |
| `.object(error?)`     | `object`          | Assert value is a non-null object        |
| `.record(error?)`     | `Record`          | Assert value is a plain object           |
| `.defined(error?)`    | `unknown`         | Assert value is not undefined            |
| `.undefined(error?)`  | `undefined`       | Assert value is undefined                |
| `.null(error?)`       | `null`            | Assert value is null                     |
| `.integer(error?)`    | `number`          | Assert value is an integer               |
| `.isize(error?)`      | `number`          | Alias for `.integer()`                   |
| `.usize(error?)`      | `number`          | Assert value is a non-negative integer   |
| `.true(error?)`       | `true`            | Assert value is exactly `true`           |
| `.false(error?)`      | `false`           | Assert value is exactly `false`          |
| `.uuid(error?)`       | `string`          | Assert value is a valid UUIDv4           |
| `.newable(error?)`    | `Newable`         | Assert value is constructable            |
| `.instance(Class)`    | `InstanceType<C>` | Assert value is instance of Class        |
| `.subclass(Class)`    | `C`               | Assert value is a subclass of Class      |
| `.anyOf(Classes[])`   | `InstanceType<T>` | Assert value is instance of any Class    |

### `every(...values)`

```ts
declare function every(...values: unknown[]): Every;
```

Creates an assertion chain for multiple values.

| Parameter   | Type        | Description            |
|-------------|-------------|------------------------|
| `...values` | `unknown[]` | The values to assert   |

**Returns**: An `Every` instance with methods similar to `Is`, but operating on
all values and returning typed arrays.

### `defined(value, error?)`

```ts
declare function defined(value: unknown, error?: string | Function): unknown;
```

Asserts that a value is not `undefined`.

| Parameter | Type                   | Description                |
|-----------|------------------------|----------------------------|
| `value`   | `unknown`              | The value to check         |
| `error`   | `string \| Function`   | Optional custom error      |

**Returns**: The value if defined.
**Throws**: If the value is `undefined`.

### `maybe(value)`

```ts
declare function maybe(value: unknown): MaybeIs;
```

Creates an optional assertion chain. Nullish values pass through without
validation.

| Parameter | Type      | Description         |
|-----------|-----------|---------------------|
| `value`   | `unknown` | The value to assert |

**Returns**: An object with the same methods as `Is`, but returning the original
nullish value (`null` or `undefined`) if the input is nullish.

## Examples

### Validating function inputs

```js
import is from "@rcompat/assert/is";

function createUser(data) {
  const name = is(data.name).string("Name must be a string");
  const age = is(data.age).usize("Age must be a non-negative integer");
  const email = is(data.email).string();
  
  return { name, age, email };
}
```

### Parsing configuration

```js
import is from "@rcompat/assert/is";
import maybe from "@rcompat/assert/maybe";

function parseConfig(config) {
  is(config).record();
  
  return {
    port: is(config.port).usize(),
    host: is(config.host).string(),
    debug: maybe(config.debug).boolean() ?? false,
  };
}
```

### Type guards with narrowing

```js
import is from "@rcompat/assert/is";

function processValue(value) {
  // After this line, TypeScript knows `value` is a string
  const str = is(value).string();
  return str.toUpperCase();
}
```

### Handling optional values

```js
import maybe from "@rcompat/assert/maybe";

function formatName(first, middle, last) {
  const f = is(first).string();
  const m = maybe(middle).string();  // can be null/undefined
  const l = is(last).string();
  
  return m ? `${f} ${m} ${l}` : `${f} ${l}`;
}

formatName("John", null, "Doe");     // "John Doe"
formatName("John", "Paul", "Doe");   // "John Paul Doe"
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

