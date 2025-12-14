# @rcompat/worker

Web Workers for JavaScript runtimes.

## What is @rcompat/worker?

A cross-runtime module providing a unified `Worker` API. Uses native workers
on Bun and Deno, and `worker_threads` on Node.js. Write worker code once and
run it on any JavaScript runtime.

## Installation

```bash
npm install @rcompat/worker
```

```bash
pnpm add @rcompat/worker
```

```bash
yarn add @rcompat/worker
```

```bash
bun add @rcompat/worker
```

## Usage

### Basic worker

**main.ts**

```ts
import Worker from "@rcompat/worker";

const worker = new Worker(new URL("./worker.ts", import.meta.url));

worker.postMessage({ task: "compute", data: [1, 2, 3] });

worker.addEventListener("message", event => {
  console.log("Result:", event.data);
});
```

**worker.ts**

```ts
self.addEventListener("message", event => {
  const { task, data } = event.data;

  if (task === "compute") {
    const result = data.reduce((a, b) => a + b, 0);
    self.postMessage(result);
  }
});
```

### Inline worker with Blob

```ts
import Worker from "@rcompat/worker";

const code = `
  self.addEventListener("message", event => {
    const result = event.data * 2;
    self.postMessage(result);
  });
`;

const blob = new Blob([code], { type: "application/javascript" });
const worker = new Worker(URL.createObjectURL(blob));

worker.postMessage(21);
worker.addEventListener("message", event => {
  console.log(event.data); // 42
});
```

### Terminate a worker

```ts
import Worker from "@rcompat/worker";

const worker = new Worker(new URL("./worker.ts", import.meta.url));

// Do some work...
worker.postMessage("start");

// Terminate when done
setTimeout(() => {
  worker.terminate();
  console.log("Worker terminated");
}, 5000);
```

### Error handling

```ts
import Worker from "@rcompat/worker";

const worker = new Worker(new URL("./worker.ts", import.meta.url));

worker.addEventListener("error", event => {
  console.error("Worker error:", event.message);
});

worker.addEventListener("messageerror", event => {
  console.error("Message error:", event);
});
```

## API Reference

### Default Export

```ts
import Worker from "@rcompat/worker";

new Worker(url: URL | string, options?: WorkerOptions);
```

Creates a new worker thread.

| Parameter | Type                | Description              |
|-----------|---------------------|--------------------------|
| `url`     | `URL \| string`     | Path to worker script    |
| `options` | `WorkerOptions`     | Optional configuration   |

### Worker Methods

| Method                    | Description                          |
|---------------------------|--------------------------------------|
| `postMessage(message)`    | Send data to the worker              |
| `terminate()`             | Stop the worker immediately          |
| `addEventListener(type, listener)` | Listen for worker events    |
| `removeEventListener(type, listener)` | Remove event listener    |

### Worker Events

| Event          | Description                              |
|----------------|------------------------------------------|
| `message`      | Received data from worker                |
| `error`        | Uncaught error in worker                 |
| `messageerror` | Message could not be deserialized        |

## How It Works

Different runtimes provide workers differently:

| Runtime | Implementation                |
|---------|-------------------------------|
| Node.js | `Worker` from `worker_threads`|
| Bun     | Native `Worker` global        |
| Deno    | Native `Worker` global        |

`@rcompat/worker` exports the appropriate `Worker` class for each runtime,
using [runtime keys](https://runtime-keys.proposal.wintercg.org) for
zero-overhead resolution at import time.

## Examples

### Parallel processing

```ts
import Worker from "@rcompat/worker";

async function processInParallel(items, workerUrl, concurrency = 4) {
  const workers = Array.from(
    { length: concurrency },
    () => new Worker(workerUrl)
  );

  const results = [];
  let index = 0;

  return new Promise(resolve => {
    workers.forEach(worker => {
      const processNext = () => {
        if (index < items.length) {
          worker.postMessage({ index: index++, item: items[index - 1] });
        } else if (results.length === items.length) {
          workers.forEach(w => w.terminate());
          resolve(results);
        }
      };

      worker.addEventListener("message", event => {
        results[event.data.index] = event.data.result;
        processNext();
      });

      processNext();
    });
  });
}
```

### Worker pool

```ts
import Worker from "@rcompat/worker";

class WorkerPool {
  #workers = [];
  #queue = [];
  #available = [];

  constructor(workerUrl, size = navigator.hardwareConcurrency || 4) {
    for (let i = 0; i < size; i++) {
      const worker = new Worker(workerUrl);
      this.#workers.push(worker);
      this.#available.push(worker);

      worker.addEventListener("message", event => {
        this.#available.push(worker);
        this.#processQueue();
      });
    }
  }

  exec(data) {
    return new Promise(resolve => {
      this.#queue.push({ data, resolve });
      this.#processQueue();
    });
  }

  #processQueue() {
    if (this.#queue.length > 0 && this.#available.length > 0) {
      const worker = this.#available.pop();
      const { data, resolve } = this.#queue.shift();

      const handler = event => {
        worker.removeEventListener("message", handler);
        resolve(event.data);
      };

      worker.addEventListener("message", handler);
      worker.postMessage(data);
    }
  }

  terminate() {
    this.#workers.forEach(w => w.terminate());
  }
}
```

### Background task

```ts
import Worker from "@rcompat/worker";

function runInBackground(fn) {
  const code = `
    self.addEventListener("message", async event => {
      const fn = new Function("return " + event.data)();
      const result = await fn();
      self.postMessage(result);
    });
  `;

  const blob = new Blob([code], { type: "application/javascript" });
  const worker = new Worker(URL.createObjectURL(blob));

  return new Promise((resolve, reject) => {
    worker.addEventListener("message", event => {
      worker.terminate();
      resolve(event.data);
    });

    worker.addEventListener("error", event => {
      worker.terminate();
      reject(new Error(event.message));
    });

    worker.postMessage(fn.toString());
  });
}

// Usage
const result = await runInBackground(() => {
  // Heavy computation
  let sum = 0;
  for (let i = 0; i < 1e8; i++) sum += i;
  return sum;
});
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

