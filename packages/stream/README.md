# @rcompat/stream

Stream utilities for JavaScript runtimes.

## What is @rcompat/stream?

A cross-runtime module providing utilities for working with Web Streams.
Convert `ReadableStream` to strings and other common stream operations.
Works consistently across Node, Deno, and Bun.

## Installation

```bash
npm install @rcompat/stream
```

```bash
pnpm add @rcompat/stream
```

```bash
yarn add @rcompat/stream
```

```bash
bun add @rcompat/stream
```

## Usage

### Convert stream to string

```js
import stream from "@rcompat/stream";

// From a ReadableStream
const readable = new ReadableStream({
  start(controller) {
    controller.enqueue(new TextEncoder().encode("Hello, "));
    controller.enqueue(new TextEncoder().encode("World!"));
    controller.close();
  }
});

const text = await stream.stringify(readable);
console.log(text); // "Hello, World!"
```

### With fetch response

```js
import stream from "@rcompat/stream";

const response = await fetch("https://example.com/data.txt");
const text = await stream.stringify(response.body);
console.log(text);
```

### With file streams

```js
import stream from "@rcompat/stream";
import FileRef from "@rcompat/fs/FileRef";

const file = new FileRef("./data.txt");
const content = await stream.stringify(await file.stream());
console.log(content);
```

## API Reference

### `stringify`

```ts
import stream from "@rcompat/stream";

stream.stringify(readable: ReadableStream): Promise<string>;
```

Reads all chunks from a `ReadableStream`, decodes them as UTF-8 text, and
concatenates them into a single string.

| Parameter | Type             | Description               |
|-----------|------------------|---------------------------|
| `stream`  | `ReadableStream` | The stream to read from   |

**Returns:** `Promise<string>` — The complete stream content as a string.

**Throws:** If the input is not a `ReadableStream` instance.

## How It Works

The `stringify` function:

1. Gets a reader from the stream via `getReader()`
2. Recursively reads chunks until `done` is `true`
3. Decodes each chunk using `TextDecoder` (UTF-8)
4. Filters out any undefined values
5. Joins all decoded chunks into a single string

```js
// Simplified implementation
const decoder = new TextDecoder();

async function stringify(stream) {
  const reader = stream.getReader();
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(decoder.decode(value));
  }

  return chunks.join("");
}
```

## Examples

### Process streaming API response

```js
import stream from "@rcompat/stream";

async function fetchJSON(url) {
  const response = await fetch(url);
  const text = await stream.stringify(response.body);
  return JSON.parse(text);
}

const data = await fetchJSON("https://api.example.com/users");
```

### Read subprocess output

```js
import stream from "@rcompat/stream";
import spawn from "@rcompat/io/spawn";

const { stdout } = spawn("ls -la", { cwd: "." });
const output = await stream.stringify(stdout);
console.log(output);
```

### Collect streaming chunks

```js
import stream from "@rcompat/stream";

async function collectSSE(url) {
  const response = await fetch(url);
  // note: For actual SSE, you'd process chunks individually
  // this example just collects everything
  return await stream.stringify(response.body);
}
```

### Transform and stringify

```js
import stream from "@rcompat/stream";

const source = new ReadableStream({
  start(controller) {
    controller.enqueue(new TextEncoder().encode("line1\n"));
    controller.enqueue(new TextEncoder().encode("line2\n"));
    controller.close();
  }
});

// transform stream (uppercase)
const transformed = source.pipeThrough(new TransformStream({
  transform(chunk, controller) {
    const text = new TextDecoder().decode(chunk);
    controller.enqueue(new TextEncoder().encode(text.toUpperCase()));
  }
}));

const result = await stream.stringify(transformed);
console.log(result); // "LINE1\nLINE2\n"
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

