# @rcompat/async

Async operation utilities for JavaScript runtimes.

## What is @rcompat/async?

A cross-runtime module providing async utilities that work consistently across
Node, Deno, and Bun. Includes parallel mapping, async context storage, and a
fluent try/catch alternative.

## Installation

```bash
npm install @rcompat/async
```

```bash
yarn add @rcompat/async
```

```bash
pnpm add @rcompat/async
```

```bash
bun add @rcompat/async
```

## Usage

### map

Parallel async map over an array using `Promise.all`. Maps all items
concurrently and waits for all to complete.

```js
import map from "@rcompat/async/map";

const urls = ["/api/users/1", "/api/users/2", "/api/users/3"];

// Fetch all users in parallel
const users = await map(urls, async (url) => {
    const response = await fetch(url);
    return response.json();
});
// [{ id: 1, ... }, { id: 2, ... }, { id: 3, ... }]
```

```js
import map from "@rcompat/async/map";

// With index parameter
const results = await map([10, 20, 30], async (value, index) => {
    return { index, doubled: value * 2 };
});
// [{ index: 0, doubled: 20 }, { index: 1, doubled: 40 }, { index: 2, doubled: 60 }]
```

### tryreturn

A fluent API for async try/catch that requires a fallback handler. Provides
safer error handling by ensuring you always handle the error case.

```js
import tryreturn from "@rcompat/async/tryreturn";

// Basic usage - fallback on error
const result = await tryreturn(async () => {
    const response = await fetch("/api/data");
    return response.json();
}).orelse(async (error) => {
    console.error("Fetch failed:", error);
    return { fallback: true };
});
```

```js
import tryreturn from "@rcompat/async/tryreturn";

// The error is passed to orelse
const user = await tryreturn(async () => {
    return await db.users.findOne({ id: userId });
}).orelse(async (error) => {
    // Log the error and return a default
    console.error(error);
    return null;
});
```

```js
import tryreturn from "@rcompat/async/tryreturn";

// Chain multiple operations
const config = await tryreturn(async () => {
    return await loadConfigFromRemote();
}).orelse(async () => {
    return await loadConfigFromCache();
});
```

### context

Re-exports `AsyncLocalStorage` from Node's `async_hooks` module. Provides a way
to store data that is accessible throughout the lifetime of an async operation.

```js
import AsyncLocalStorage from "@rcompat/async/context";

const requestContext = new AsyncLocalStorage();

// Store context for the duration of a request
function handleRequest(req, res) {
    const store = { requestId: crypto.randomUUID(), user: req.user };

    requestContext.run(store, async () => {
        await processRequest();
        await sendResponse(res);
    });
}

// Access context anywhere in the call chain
function log(message) {
    const ctx = requestContext.getStore();
    console.log(`[${ctx?.requestId}] ${message}`);
}
```

## API Reference

### `map(array, mapper)`

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

### `tryreturn(trial)`

```ts
declare function tryreturn<T>(trial: () => Promise<T>): {
    orelse: <U>(backup: (error: unknown) => Promise<U>) => PromiseLike<T | U>;
};
```

Creates a try/catch chain for async operations with a required fallback.

| Parameter | Type               | Description                   |
| --------- | ------------------ | ----------------------------- |
| `trial`   | `() => Promise<T>` | The async function to attempt |

**Returns**: An object with an `orelse` method.

#### `.orelse(backup)`

| Parameter | Type                             | Description                       |
| --------- | -------------------------------- | --------------------------------- |
| `backup`  | `(error: unknown) => Promise<U>` | Fallback function called on error |

**Returns**: A promise that resolves to either the trial result or the backup result.

**Throws**: If `orelse` is not called before awaiting.

### `context` (AsyncLocalStorage)

```ts
declare const context: typeof AsyncLocalStorage;
```

Re-export of Node's `AsyncLocalStorage` class for storing async context.

| Method                  | Description                                    |
| ----------------------- | ---------------------------------------------- |
| `.run(store, callback)` | Run callback with the given store as context   |
| `.getStore()`           | Get the current store (or undefined if none)   |
| `.enterWith(store)`     | Enter a new async context with the given store |

## Examples

### Parallel API requests

```js
import map from "@rcompat/async/map";

async function fetchAllProducts(ids) {
    return map(ids, async (id) => {
        const response = await fetch(`/api/products/${id}`);
        return response.json();
    });
}

const products = await fetchAllProducts([1, 2, 3, 4, 5]);
```

### Safe database operations

```js
import tryreturn from "@rcompat/async/tryreturn";

async function getUser(id) {
    return tryreturn(async () => {
        return await db.query("SELECT * FROM users WHERE id = ?", [id]);
    }).orelse(async (error) => {
        logger.error("Database query failed", { error, id });
        return null;
    });
}
```

### Request-scoped logging

```js
import AsyncLocalStorage from "@rcompat/async/context";
import map from "@rcompat/async/map";

const context = new AsyncLocalStorage();

async function handleRequest(req) {
    return context.run({ requestId: crypto.randomUUID() }, async () => {
        log("Request started");
        const results = await map(req.items, processItem);
        log("Request completed");
        return results;
    });
}

function log(message) {
    const { requestId } = context.getStore() ?? {};
    console.log(`[${requestId}] ${message}`);
}
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
