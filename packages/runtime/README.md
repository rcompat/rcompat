# @rcompat/runtime

Runtime detection for JavaScript environments.

## What is @rcompat/runtime?

A cross-runtime module that tells you which JavaScript runtime your code is
executing in. Uses [runtime keys](https://runtime-keys.proposal.wintercg.org)
for accurate detection without any runtime overhead.

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

console.log(runtime);
// "node" | "bun" | "deno" | "workerd" | "vercel" | "netlify" | "fastly" | "browser"
```

### Conditional logic

```js
import runtime from "@rcompat/runtime";

if (runtime === "bun") {
  // Bun-specific code
} else if (runtime === "deno") {
  // Deno-specific code
} else if (runtime === "node") {
  // Node.js-specific code
}
```

### Feature detection

```js
import runtime from "@rcompat/runtime";

function getFileReader() {
  switch (runtime) {
    case "bun":
      return Bun.file;
    case "deno":
      return Deno.readFile;
    default:
      return require("fs").promises.readFile;
  }
}
```

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

### Default Export

```ts
declare const runtime:
  | "node"
  | "bun"
  | "deno"
  | "workerd"
  | "vercel"
  | "netlify"
  | "fastly"
  | "browser";
```

A string identifying the current runtime environment.

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

## Examples

### Runtime-specific logging

```js
import runtime from "@rcompat/runtime";

const logger = {
  info(message) {
    const prefix = `[${runtime}]`;
    console.log(prefix, message);
  }
};

logger.info("Server started");
// [node] Server started
// [bun] Server started
// etc.
```

### Environment checks

```js
import runtime from "@rcompat/runtime";

const isServerRuntime = ["node", "bun", "deno"].includes(runtime);
const isEdgeRuntime = ["workerd", "vercel", "netlify", "fastly"].includes(runtime);
const isClientRuntime = runtime === "browser";

if (isEdgeRuntime) {
  // Limited APIs available
}
```

### Polyfill loading

```js
import runtime from "@rcompat/runtime";

async function setup() {
  if (runtime === "node") {
    // Node.js doesn't have fetch in older versions
    globalThis.fetch ??= (await import("node-fetch")).default;
  }
}
```

### Debug information

```js
import runtime from "@rcompat/runtime";

function getDebugInfo() {
  return {
    runtime,
    timestamp: Date.now(),
    userAgent: runtime === "browser" ? navigator.userAgent : undefined,
  };
}
```

## Cross-Runtime Compatibility

| Runtime         | Supported |
|-----------------|-----------|
| Node.js         | ✓         |
| Bun             | ✓         |
| Deno            | ✓         |
| Cloudflare Workers | ✓      |
| Vercel Edge     | ✓         |
| Netlify Edge    | ✓         |
| Fastly Compute  | ✓         |
| Browser         | ✓         |

No configuration required — just import and use.

## License

MIT

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) in the repository root.

