# @rcompat/record

Object/record utilities for JavaScript runtimes.

## What is @rcompat/record?

A cross-runtime module providing utilities for working with objects and records.
Includes chainable entry manipulation, deep merging, path-based access, and more.
Works consistently across Node, Deno, and Bun.

## Installation

```bash
npm install @rcompat/record
```

```bash
pnpm add @rcompat/record
```

```bash
yarn add @rcompat/record
```

```bash
bun add @rcompat/record
```

## Usage

### empty

Checks if an object has no keys.

```js
import empty from "@rcompat/record/empty";

empty({});           // true
empty({ a: 1 });     // false
empty({ a: undefined }); // false (key exists)
```

### entries

Chainable wrapper around `Object.entries` with filter, map, and transform methods.

```js
import entries from "@rcompat/record/entries";

const obj = { a: 1, b: 2, c: 3 };

// Filter entries
entries(obj)
  .filter(([key, value]) => value > 1)
  .get();  // { b: 2, c: 3 }

// Map values
entries(obj)
  .valmap(([key, value]) => value * 2)
  .get();  // { a: 2, b: 4, c: 6 }

// Map keys
entries(obj)
  .keymap(([key]) => key.toUpperCase())
  .get();  // { A: 1, B: 2, C: 3 }

// Chain operations
entries(obj)
  .filter(([, v]) => v > 1)
  .valmap(([, v]) => v * 10)
  .get();  // { b: 20, c: 30 }

// Iterate
for (const [key, value] of entries(obj)) {
  console.log(key, value);
}
```

### exclude

Creates a new object excluding specified keys.

```js
import exclude from "@rcompat/record/exclude";

const user = { id: 1, name: "Alice", password: "secret" };

exclude(user, ["password"]);
// { id: 1, name: "Alice" }

exclude(user, ["id", "password"]);
// { name: "Alice" }
```

### get

Gets a nested value using dot notation.

```js
import get from "@rcompat/record/get";

const data = {
  user: {
    profile: {
      name: "Alice",
    },
  },
};

get(data, "user.profile.name");  // "Alice"
get(data, "user.profile");       // { name: "Alice" }
get(data, "user.missing");       // undefined
```

### inflate

Creates a nested object from a dot-notation path.

```js
import inflate from "@rcompat/record/inflate";

inflate("a.b.c");
// { a: { b: { c: {} } } }

inflate("a.b.c", "value");
// { a: { b: { c: "value" } } }

inflate("a/b/c", "value", "/");
// { a: { b: { c: "value" } } }
```

### override

Deep merges objects recursively. Values from the second object override the first.

```js
import override from "@rcompat/record/override";

override({ a: 1 }, { b: 2 });
// { a: 1, b: 2 }

override({ a: 1 }, { a: 2 });
// { a: 2 }

// Deep merge
override(
  { user: { name: "Alice", age: 30 } },
  { user: { age: 31 } }
);
// { user: { name: "Alice", age: 31 } }
```

### proper

Type guard that checks if a value is a non-null object.

```js
import proper from "@rcompat/record/proper";

proper({});          // true
proper([]);          // true
proper(null);        // false
proper(undefined);   // false
proper("string");    // false
```

### nullproto

Creates objects with null prototype (no inherited properties like `toString`).

```js
import nullproto from "@rcompat/record/nullproto";

// Empty null-prototype object
const empty = nullproto();
empty.toString;  // undefined (no inherited methods)

// With initial values
const obj = nullproto({ a: 1, b: 2 });
obj.a;           // 1
obj.toString;    // undefined

// Frozen (immutable)
const frozen = nullproto({ a: 1 }, { frozen: true });
frozen.a = 2;    // TypeError in strict mode
```

### toQueryString

Converts an object to a URL query string.

```js
import toQueryString from "@rcompat/record/toQueryString";

toQueryString({ page: "1", sort: "name" });
// "page=1&sort=name"

toQueryString({ q: "hello", limit: "10" });
// "q=hello&limit=10"
```

## API Reference

### `empty(object)`

```ts
declare function empty(object: object): boolean;
```

Returns `true` if the object has no own keys.

### `entries(record)`

```ts
declare function entries<K extends string, V>(record: Record<K, V>): Entries<K, V>;

interface Entries<K, V> {
  filter(predicate: (entry: [K, V]) => boolean): Entries<K, V>;
  map<U>(mapper: (entry: [K, V]) => [K, U]): Entries<K, U>;
  keymap(mapper: (entry: [K, V]) => K): Entries<K, V>;
  valmap<U>(mapper: (entry: [K, V]) => U): Entries<K, U>;
  get(): Record<K, V>;
  [Symbol.iterator](): IterableIterator<[K, V]>;
}
```

### `exclude(object, keys)`

```ts
declare function exclude<T extends object, K extends keyof T>(
  object: T,
  keys: readonly K[]
): Omit<T, K>;
```

### `get(object, path)`

```ts
declare function get<T extends object, P extends string>(
  object: T,
  path: P
): unknown;
```

### `inflate(path, initial?, separator?)`

```ts
declare function inflate<P extends string, T>(
  path: P,
  initial?: T,
  separator?: string
): object;
```

### `override(base, over)`

```ts
declare function override<T extends object, U extends object>(
  base: T,
  over: U
): T & U;
```

### `proper(value)`

```ts
declare function proper(value: unknown): value is NonNullable<object>;
```

### `nullproto(init?, options?)`

```ts
declare function nullproto<T extends object>(
  init?: T,
  options?: { frozen?: boolean }
): T;
```

### `toQueryString(dict)`

```ts
declare function toQueryString(dict: Record<string, string>): string;
```

## Examples

### Sanitize API response

```js
import exclude from "@rcompat/record/exclude";
import entries from "@rcompat/record/entries";

function sanitizeUser(user) {
  return exclude(user, ["password", "ssn", "creditCard"]);
}

function transformResponse(data) {
  return entries(data)
    .filter(([key]) => !key.startsWith("_"))
    .valmap(([, value]) => value ?? "N/A")
    .get();
}
```

### Configuration with defaults

```js
import override from "@rcompat/record/override";

const defaults = {
  host: "localhost",
  port: 3000,
  db: {
    host: "localhost",
    port: 5432,
  },
};

function createConfig(userConfig) {
  return override(defaults, userConfig);
}

createConfig({ port: 8080, db: { port: 5433 } });
// { host: "localhost", port: 8080, db: { host: "localhost", port: 5433 } }
```

### Build URL with query params

```js
import toQueryString from "@rcompat/record/toQueryString";

function buildUrl(base, params) {
  const query = toQueryString(params);
  return query ? `${base}?${query}` : base;
}

buildUrl("/api/users", { page: "1", limit: "10" });
// "/api/users?page=1&limit=10"
```

### Safe configuration objects

```js
import nullproto from "@rcompat/record/nullproto";

// Prevent prototype pollution
const config = nullproto({
  apiKey: "secret",
  endpoint: "https://api.example.com",
}, { frozen: true });

// Safe from prototype attacks
config.__proto__;     // undefined
config.constructor;   // undefined
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

