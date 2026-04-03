# @rcompat/runtime

Runtime detection for JavaScript environments.

## What is @rcompat/runtime?

A cross-runtime module that tells you which JavaScript runtime your code is
executing in, and provides runtime-specific utilities like the executable path,
current script, arguments, and process exit. Uses
[runtime keys](https://runtime-keys.proposal.wintercg.org) for accurate
detection without any runtime overhead.

## Installation

```bash
npm install @rcompat/runtime
```

```bash
pnpm add @rcompat/runtime
```

```bash
yarn add @rcompat/runtime
```

```bash
bun add @rcompat/runtime
```

## Usage

### Basic detection

```js
import runtime from "@rcompat/runtime";

console.log(runtime.name);
// "node" | "bun" | "deno" | "browser"
```

### Conditional logic

```js
import runtime from "@rcompat/runtime";

if (runtime.name === "bun") {
  // Bun-specific code
} else if (runtime.name === "deno") {
  // Deno-specific code
} else if (runtime.name === "node") {
  // Node.js-specific code
}
```

### Executable path

```js
import runtime from "@rcompat/runtime";

console.log(runtime.bin);
// "/usr/local/bin/node"
// "/home/user/.bun/bin/bun"
// "/usr/bin/deno"
```

### Current script

```js
import runtime from "@rcompat/runtime";

console.log(runtime.script);
// "/path/to/your/script.js"
```

### Program arguments

```js
import runtime from "@rcompat/runtime";

// running: node app.js foo bar
console.log(runtime.args);
// ["foo", "bar"]
```

`runtime.args` always contains only your program's arguments — the runtime
executable and script path are stripped away, consistently across all runtimes.

### Exiting the process

```js
import runtime from "@rcompat/runtime";

runtime.exit(0);  // success
runtime.exit(1);  // failure
```

`runtime.exit` is `undefined` in browser and edge runtimes where process exit
has no meaning.

## Supported Runtimes

| Runtime        | Value       | Environment                |
|----------------|-------------|----------------------------|
| Node.js        | `"node"`    | Standard Node.js           |
| Bun            | `"bun"`     | Bun runtime                |
| Deno           | `"deno"`    | Deno runtime               |
| Cloudflare     | `"workerd"` | Cloudflare Workers         |
| Vercel         | `"vercel"`  | Vercel Edge Functions      |
| Netlify        | `"netlify"` | Netlify Edge Functions     |
| Fastly         | `"fastly"`  | Fastly Compute@Edge        |
| Browser        | `"browser"` | Web browsers               |

## API Reference

### `runtime.name`

```ts
runtime.name: "node" | "bun" | "deno" | "workerd" | "vercel" | "netlify" | "fastly" | "browser";
```

A string identifying the current runtime environment.

### `runtime.bin`

```ts
runtime.bin: string | undefined;
```

Full path to the runtime executable. `undefined` in browser and edge runtimes.

### `runtime.script`

```ts
runtime.script: string | undefined;
```

Full path to the currently executing script. `undefined` in browser and edge
runtimes.

### `runtime.args`

```ts
runtime.args: string[];
```

Program arguments, with the runtime executable and script path stripped.
Always an array — empty if no arguments were passed. `[]` in browser and edge
runtimes.

### `runtime.exit`

```ts
runtime.exit: ((code?: number) => never) | undefined;
```

Exit the current process with an optional exit code. `undefined` in browser
and edge runtimes where process exit has no meaning.

### `runtime.resolve`

```ts
runtime.resolve(specifier: string, from: string): string
```

Resolve a path or package specifier from a directory.

* Relative specifiers like `./foo.json` and `../tsconfig.json` are resolved
from `from`
* Absolute paths are returned as absolute paths
* Package specifiers like `apekit/tsconfig` are resolved using the current
runtime’s package resolution

## How It Works

This package uses [runtime keys](https://runtime-keys.proposal.wintercg.org),
a WinterCG proposal for runtime detection. The `exports` field in `package.json`
routes to different files based on the runtime condition, meaning detection
happens at import time with zero runtime overhead.

```json
{
  "exports": {
    ".": {
      "bun": "./lib/public/bun.js",
      "deno": "./lib/public/deno.js",
      "workerd": "./lib/public/cloudflare.js",
      "node": "./lib/public/node.js"
    }
  }
}
```

Each file simply exports the runtime object for that environment:

```ts
// node.ts
export default {
  name: "node",
  bin: process.execPath,
  script: process.argv[1],
  args: process.argv.slice(2),
  exit: (code?: number) => process.exit(code),
};
```

## Examples

### Relaunching with custom flags

```js
import runtime from "@rcompat/runtime";
import io from "@rcompat/io";

// relaunch self with --conditions=source
await io.spawn(
  `${runtime.bin} --conditions="@rcompat/source" ${runtime.script} ${runtime.args.join(" ")}`,
  { inherit: true }
);
runtime.exit(0);
```

### Runtime-specific logging

```js
import runtime from "@rcompat/runtime";

const logger = {
  info(message) {
    console.log(`[${runtime.name}]`, message);
  }
};

logger.info("Server started");
// [node] Server started
// [bun] Server started
```

### Environment checks

```js
import runtime from "@rcompat/runtime";

const isServerRuntime = ["node", "bun", "deno"].includes(runtime.name);
const isEdgeRuntime = ["workerd", "vercel", "netlify", "fastly"].includes(runtime.name);
const isClientRuntime = runtime.name === "browser";
```

### Debug information

```js
import runtime from "@rcompat/runtime";

function getDebugInfo() {
  return {
    runtime: runtime.name,
    script: runtime.script,
    args: runtime.args,
    timestamp: Date.now(),
  };
}
```

### Reading tsconfig `customConditions` recursively

```ts
import fs from "@rcompat/fs":

type TSConfig = {
  compilerOptions?: {
    customConditions?: string[];
  };
  extends?: string;
};

async function read_conditions(file: FileRef) {
  const json = await file.json<TSConfig>();

  if (json.compilerOptions?.customConditions?.length) {
    return json.compilerOptions.customConditions;
  }

  if (json.extends === undefined) {
    return [];
  }

  const next = runtime.resolve(json.extends, file.directory.path);
  return read_conditions(fs.ref(next));
}
```

## Cross-Runtime Compatibility

| Runtime            | Supported |
|--------------------|-----------|
| Node.js            | ✓         |
| Bun                | ✓         |
| Deno               | ✓         |
| Browser            | ✓         |

No configuration required — just import and use.

## License

MIT

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) in the repository root.
