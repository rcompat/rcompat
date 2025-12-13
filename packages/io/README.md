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
import stdin from "@rcompat/io/stdin";
import stdout from "@rcompat/io/stdout";
import stderr from "@rcompat/io/stderr";

// write to stdout (no newline)
stdout.write("Hello, ");
stdout.write("World!\n");

// write to stderr
stderr.write("Error: something went wrong\n");
```

### Check if running in a terminal

```js
import isatty from "@rcompat/io/isatty";

if (isatty()) {
  // interactive terminal - show colors, prompts, etc.
   console.log("\x1b[32mGreen text!\x1b[0m");
} else {
  // piped or redirected - plain output
  console.log("Plain text");
}
```

### Read a line from stdin

```js
import readline from "@rcompat/io/readline";

const name = await readline();

if (name === null) {
  // user pressed Ctrl+C or Ctrl+D
  console.log("Cancelled");
} else {
  console.log(`Hello, ${name}!`);
}
```

### Execute a command

```js
import execute from "@rcompat/io/execute";

// get command output as string
const output = await execute("echo hello");
console.log(output); // "hello\n"

// with options
const files = await execute("ls -la", { cwd: "/tmp" });
```

### Spawn a process

```js
import spawn from "@rcompat/io/spawn";

const { stdin, stdout, stderr } = spawn("cat", { cwd: "." });

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
import which from "@rcompat/io/which";

const nodePath = await which("node");
console.log(nodePath); // "/usr/local/bin/node"

const bunPath = await which("bun");
console.log(bunPath); // "/home/user/.bun/bin/bun"
```

## API Reference

### `stdin`

```ts
import stdin from "@rcompat/io/stdin";
```

The standard input stream. A `ReadStream` for reading user input.

### `stdout`

```ts
import stdout from "@rcompat/io/stdout";

stdout.write(data: string | Uint8Array): boolean;
```

The standard output stream. Use `write()` to output without a newline.

### `stderr`

```ts
import stderr from "@rcompat/io/stderr";

stderr.write(data: string | Uint8Array): boolean;
```

The standard error stream. Use for error messages and diagnostics.

### `isatty`

```ts
import isatty from "@rcompat/io/isatty";

isatty(): boolean;
```

Returns `true` if stdout is connected to a terminal (TTY).

### `readline`

```ts
import readline from "@rcompat/io/readline";

readline(): Promise<string | null>;
```

Reads a single line from stdin. Returns `null` if the user cancels (Ctrl+C)
or sends EOF (Ctrl+D).

### `execute`

```ts
import execute from "@rcompat/io/execute";

execute(command: string, options?: ExecOptions): Promise<string>;
```

Executes a shell command and returns its stdout as a string. Rejects on error.

| Parameter | Type          | Description                |
| --------- | ------------- | -------------------------- |
| `command` | `string`      | Shell command to execute   |
| `options` | `ExecOptions` | Optional execution options |

Options include `cwd`, `env`, `timeout`, `maxBuffer`, etc.

### `spawn`

```ts
import spawn from "@rcompat/io/spawn";

spawn(command: string, options: SpawnOptions): {
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
import which from "@rcompat/io/which";

which(command: string): Promise<string>;
```

Finds the full path to an executable. Cross-platform (uses `which` on Unix,
`where` on Windows).

## Examples

### Interactive prompt

```js
import stdout from "@rcompat/io/stdout";
import readline from "@rcompat/io/readline";
import isatty from "@rcompat/io/isatty";

async function prompt(message) {
  if (isatty()) {
    stdout.write(message);
  }
  return await readline();
}

const name = await prompt("Enter your name: ");
if (name) {
  console.log(`Welcome, ${name}!`);
}
```

### Run a command and process output

```js
import execute from "@rcompat/io/execute";

async function getGitBranch() {
  try {
    const branch = await execute("git branch --show-current");
    return branch.trim();
  } catch {
    return null;
  }
}

const branch = await getGitBranch();
console.log(`Current branch: ${branch ?? "not a git repo"}`);
```

### Stream processing with spawn

```js
import spawn from "@rcompat/io/spawn";

const { stdout } = spawn("ping -c 3 localhost", { cwd: "." });

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
import which from "@rcompat/io/which";

async function checkDependencies(tools) {
  const missing = [];

  for (const tool of tools) {
    try {
      await which(tool);
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
import stdout from "@rcompat/io/stdout";
import isatty from "@rcompat/io/isatty";

function log(message, color = 32) {
  if (isatty()) {
    stdout.write(`\x1b[${color}m${message}\x1b[0m\n`);
  } else {
    stdout.write(`${message}\n`);
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
