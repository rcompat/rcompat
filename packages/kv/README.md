# @rcompat/kv

Key-value storage utilities for JavaScript runtimes.

## What is @rcompat/kv?

A cross-runtime module providing key-value storage abstractions. Currently
includes a singleton cache with symbol-based keys and lazy initialization.
Works consistently across Node, Deno, and Bun.

## Installation

```bash
npm install @rcompat/kv
```

```bash
pnpm add @rcompat/kv
```

```bash
yarn add @rcompat/kv
```

```bash
bun add @rcompat/kv
```

## Usage

### cache

A singleton key-value cache using symbols as keys. Supports lazy initialization.

```js
import cache from "@rcompat/kv/cache";

// Define a symbol key
const CONFIG = Symbol("config");

// Get with initializer (runs only on first access)
const config = cache.get(CONFIG, () => ({
  apiUrl: "https://api.example.com",
  timeout: 5000,
}));

// Subsequent gets return the cached value
cache.get(CONFIG);  // Same object, initializer not called again
```

### Lazy initialization

The initializer function is only called if the key doesn't exist yet.

```js
import cache from "@rcompat/kv/cache";

const DB_CONNECTION = Symbol("db");

// Connection is established only on first access
function getDb() {
  return cache.get(DB_CONNECTION, () => {
    console.log("Connecting to database...");
    return createConnection();
  });
}

getDb();  // "Connecting to database..." - initializer runs
getDb();  // Returns cached connection, no log
getDb();  // Returns cached connection, no log
```

### Symbol uniqueness

Each symbol is unique, even with the same description.

```js
import cache from "@rcompat/kv/cache";

const KEY_A = Symbol("data");
const KEY_B = Symbol("data");

cache.get(KEY_A, () => "value A");
cache.get(KEY_B, () => "value B");

cache.get(KEY_A);  // "value A"
cache.get(KEY_B);  // "value B"
cache.get(Symbol("data"));  // undefined (different symbol)
```

## API Reference

### `cache.get(key, init?)`

```ts
declare function get<T>(key: symbol, init?: () => T): T | undefined;
```

Gets a value from the cache by symbol key, optionally initializing it.

| Parameter | Type        | Description                              |
|-----------|-------------|------------------------------------------|
| `key`     | `symbol`    | The symbol key to look up                |
| `init`    | `() => T`   | Optional initializer called if key missing |

**Returns**: The cached value, or `undefined` if not found and no initializer provided.

**Behavior**:
- If the key exists, returns the cached value
- If the key doesn't exist and `init` is provided, calls `init()`, caches and returns the result
- If the key doesn't exist and no `init`, returns `undefined`

## Examples

### Application-wide singletons

```js
import cache from "@rcompat/kv/cache";

// Define keys for your singletons
const LOGGER = Symbol("logger");
const CONFIG = Symbol("config");
const HTTP_CLIENT = Symbol("http");

// Logger singleton
export function getLogger() {
  return cache.get(LOGGER, () => createLogger({
    level: "info",
    format: "json",
  }));
}

// Config singleton (loaded once)
export function getConfig() {
  return cache.get(CONFIG, () => loadConfigFromEnv());
}

// HTTP client singleton
export function getHttpClient() {
  return cache.get(HTTP_CLIENT, () => createHttpClient({
    timeout: 30000,
    retries: 3,
  }));
}
```

### Module-level caching

```js
// user-service.js
import cache from "@rcompat/kv/cache";

const USERS_CACHE = Symbol("users");

export function getUsers() {
  return cache.get(USERS_CACHE, async () => {
    const response = await fetch("/api/users");
    return response.json();
  });
}
```

### Expensive computation caching

```js
import cache from "@rcompat/kv/cache";

const COMPUTED_DATA = Symbol("computed");

function getComputedData() {
  return cache.get(COMPUTED_DATA, () => {
    console.log("Computing expensive data...");
    // This only runs once
    return heavyComputation();
  });
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

