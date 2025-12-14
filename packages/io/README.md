# @rcompat/io

Standard input/output utilities for JavaScript runtimes.

## What is @rcompat/io?

A cross-runtime module providing access to standard streams (stdin, stdout,
stderr) and process utilities like executing commands, spawning processes,
and reading user input. Works consistently across Node, Deno, and Bun.

## Installation

```bash
npm install @rcompat/io
```

```bash
pnpm add @rcompat/io
```

```bash
yarn add @rcompat/io
```

```bash
bun add @rcompat/io
```

## Usage

### Standard streams

```js
import std from "@rcompat/io/std";

// write to stdout (no newline)
std.out.write("Hello, ");
std.out.write("World!\n");

// write to stderr
std.err.write("Error: something went wrong\n");
```

### Check if running in a terminal

```js
import io from "@rcompat/io";

if (io.isatty()) {
  // interactive terminal - show colors, prompts, etc.
  console.log("\x1b[32mGreen text!\x1b[0m");
} else {
  // piped or redirected - plain output
  console.log("Plain text");
}
```

### Run a command

```js
import io from "@rcompat/io";

// get command output as string
const output = await io.run("echo hello");
console.log(output); // "hello\n"

// with options
const files = await io.run("ls -la", { cwd: "/tmp" });
```

### Spawn a process

```js
import io from "@rcompat/io";

const { stdin, stdout, stderr } = io.spawn("cat", { cwd: "." });

// write to process stdin (Web WritableStream)
const writer = stdin.getWriter();
await writer.write(new TextEncoder().encode("Hello from stdin!"));
await writer.close();

// read from process stdout (Web ReadableStream)
const reader = stdout.getReader();
const { value } = await reader.read();
console.log(new TextDecoder().decode(value)); // "Hello from stdin!"
```

### Find an executable

```js
import io from "@rcompat/io";

const node = await io.which("node");
console.log(node); // "/usr/local/bin/node"

const bun = await io.which("bun");
console.log(bun); // "/home/user/.bun/bin/bun"
```

## API Reference

### `std.in`

```ts
import std from "@rcompat/io/std";
```

The standard input stream. A `ReadStream` for reading user input.

### `std.out`

```ts
import std from "@rcompat/io/std";

std.out.write(data: string | Uint8Array): boolean;
```

The standard output stream. Use `write()` to output without a newline.

### `std.err`

```ts
import std from "@rcompat/io/std";

std.err.write(data: string | Uint8Array): boolean;
```

The standard error stream. Use for error messages and diagnostics.

### `isatty`

```ts
import io from "@rcompat/io";

io.isatty(): boolean;
```

Returns `true` if stdout is connected to a terminal (TTY).

### `run`

```ts
import io from "@rcompat/io";

io.run(command: string, options?: ExecOptions): Promise<string>;
```

Runs a shell command and returns its stdout as a string. Rejects on error.

| Parameter | Type          | Description                |
| --------- | ------------- | -------------------------- |
| `command` | `string`      | Shell command to execute   |
| `options` | `ExecOptions` | Optional execution options |

Options include `cwd`, `env`, `timeout`, `maxBuffer`, etc.

### `spawn`

```ts
import io from "@rcompat/io";

io.spawn(command: string, options: SpawnOptions): {
  stdin: WritableStream<Uint8Array>;
  stdout: ReadableStream<Uint8Array>;
  stderr: ReadableStream<Uint8Array>;
};
```

Spawns a process and returns Web Streams for I/O.

| Parameter | Type           | Description               |
| --------- | -------------- | ------------------------- |
| `command` | `string`       | Command to spawn          |
| `options` | `SpawnOptions` | Spawn options (e.g., cwd) |

### `which`

```ts
import io from "@rcompat/io";

io.which(command: string): Promise<string>;
```

Finds the full path to an executable. Cross-platform (uses `which` on Unix,
`where` on Windows).

## Examples

### Run a command and process output

```js
import io from "@rcompat/io";

async function getBranch() {
  try {
    const branch = await io.run("git branch --show-current");
    return branch.trim();
  } catch {
    return null;
  }
}

const branch = await getBranch();
console.log(`Current branch: ${branch ?? "not a git repo"}`);
```

### Stream processing with spawn

```js
import io from "@rcompat/io";

const { stdout } = io.spawn("ping -c 3 localhost", { cwd: "." });

const reader = stdout.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  process.stdout.write(decoder.decode(value));
}
```

### Check for required tools

```js
import io from "@rcompat/io";

async function checkDependencies(tools) {
  const missing = [];

  for (const tool of tools) {
    try {
      await io.which(tool);
    } catch {
      missing.push(tool);
    }
  }

  return missing;
}

const missing = await checkDependencies(["git", "node", "docker"]);

if (missing.length > 0) {
  console.error(`Missing tools: ${missing.join(", ")}`);
  process.exit(1);
}
```

### Conditional formatting

```js
import std from "@rcompat/io";
import io from "@rcompat/io";

function log(message, color = 32) {
  if (io.isatty()) {
    std.out.write(`\x1b[${color}m${message}\x1b[0m\n`);
  } else {
    std.out.write(`${message}\n`);
  }
}

log("Success!", 32); // green in terminal, plain when piped
log("Warning!", 33); // yellow in terminal
log("Error!", 31); // red in terminal
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
