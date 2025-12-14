# @rcompat/build

Client-side bundler powered by esbuild.

## What is @rcompat/build?

A cross-runtime build tool wrapping esbuild with development and production
modes, hot reload support, and framework presets. Works consistently across
Node, Deno, and Bun.

## Installation

```bash
npm install @rcompat/build
```

```bash
pnpm add @rcompat/build
```

```bash
yarn add @rcompat/build
```

```bash
bun add @rcompat/build
```

## Usage

### Basic build

```js
import Build from "@rcompat/build";

const build = new Build({
  name: "app",
  entryPoints: ["src/index.ts"],
  outdir: "dist",
});

// Add exports to the bundle
build.export('import "./styles.css";');
build.export('import { render } from "./main.ts";');

await build.start();
```

### Development vs Production

```js
import Build from "@rcompat/build";
import { dev, prod } from "@rcompat/build/modes";

// Development mode (default)
// - No minification
// - Hot reload enabled
// - Output: app.js
const devBuild = new Build({ name: "app", outdir: "dist" }, dev);

// Production mode
// - Minified output
// - Code splitting enabled
// - Output: app-[hash].js
const prodBuild = new Build({ name: "app", outdir: "dist" }, prod);
```

### Hot reload

In development mode, the build automatically injects hot reload code using
Server-Sent Events.

```js
import Build from "@rcompat/build";

const build = new Build({
  name: "app",
  outdir: "public",
  hotreload: {
    host: "localhost",
    port: 6262,  // default
  },
});

await build.start();

// Use the proxy in your server to forward requests
// to the esbuild dev server
function handler(request) {
  return build.proxy(request, () => {
    // Your normal request handling
    return new Response("Hello");
  });
}
```

### Plugins

```js
import Build from "@rcompat/build";

const build = new Build({ name: "app", outdir: "dist" });

build.plugin({
  name: "example",
  setup(build) {
    build.onLoad({ filter: /\.txt$/ }, async (args) => {
      const text = await Deno.readTextFile(args.path);
      return { contents: JSON.stringify(text), loader: "json" };
    });
  },
});

await build.start();
```

### Artifact storage

Store and retrieve build artifacts (useful for plugins).

```js
import Build from "@rcompat/build";

const build = new Build({ name: "app", outdir: "dist" });

// Save an artifact
build.save("virtual:config", JSON.stringify({ theme: "dark" }));

// Load an artifact
const config = build.load("virtual:config");
```

### Transform

Transform code without bundling using esbuild's transform API.

```js
import transform from "@rcompat/build/transform";

const result = await transform("const x: number = 1;", {
  loader: "ts",
});

console.log(result.code);  // "const x = 1;\n"
```

```js
// Synchronous transform
import transformSync from "@rcompat/build/sync/transform";

const result = transformSync("const x: number = 1;", {
  loader: "ts",
});
```

### Presets

Pre-configured transform options for different frameworks.

```js
import transform from "@rcompat/build/transform";
import react from "@rcompat/build/preset/react";
import typescript from "@rcompat/build/preset/typescript";
import angular from "@rcompat/build/preset/angular";
import voby from "@rcompat/build/preset/voby";

// React/JSX
const jsxResult = await transform(jsxCode, react);

// TypeScript
const tsResult = await transform(tsCode, typescript);

// Angular (with decorators)
const angularResult = await transform(angularCode, angular);

// Voby (React-like framework)
const vobyResult = await transform(vobyCode, voby);
```

## API Reference

### `Build`

```ts
new Build(options?: BuildOptions, mode?: "development" | "production")
```

| Parameter | Type                           | Default         | Description            |
|-----------|--------------------------------|-----------------|------------------------|
| `options` | `BuildOptions`                 | `{}`            | esbuild build options  |
| `mode`    | `"development" \| "production"` | `"development"` | Build mode             |

#### BuildOptions

Extends esbuild's `BuildOptions` with:

| Property    | Type                          | Description                    |
|-------------|-------------------------------|--------------------------------|
| `name`      | `string`                      | Output filename (without ext)  |
| `hotreload` | `{ host: string, port: number }` | Hot reload server config    |

#### Methods

| Method                     | Returns         | Description                          |
|----------------------------|-----------------|--------------------------------------|
| `plugin(plugin)`           | `void`          | Add an esbuild plugin                |
| `save(path, source)`       | `void`          | Store a build artifact               |
| `load(path)`               | `string`        | Retrieve a build artifact            |
| `export(code)`             | `void`          | Add code to the bundle entry         |
| `start()`                  | `Promise<void>` | Start the build (watch in dev mode)  |
| `stop()`                   | `void`          | Stop the build context               |
| `proxy(request, fallback)` | `Response`      | Proxy requests to dev server         |

#### Properties

| Property      | Type      | Description                      |
|---------------|-----------|----------------------------------|
| `development` | `boolean` | `true` if in development mode    |

### `transform`

```ts
declare function transform(
  code: string,
  options?: TransformOptions
): Promise<TransformResult>;
```

Re-export of esbuild's `transform` function.

### `transformSync`

```ts
declare function transformSync(
  code: string,
  options?: TransformOptions
): TransformResult;
```

Re-export of esbuild's `transformSync` function. Import from `@rcompat/build/sync/transform`.

### Presets

| Preset       | Import Path                      | Description                    |
|--------------|----------------------------------|--------------------------------|
| `react`      | `@rcompat/build/preset/react`    | JSX automatic, TSX loader      |
| `typescript` | `@rcompat/build/preset/typescript` | TypeScript loader            |
| `angular`    | `@rcompat/build/preset/angular`  | TS with experimental decorators |
| `voby`       | `@rcompat/build/preset/voby`     | Voby JSX configuration         |

## Examples

### Full development setup

```js
import Build from "@rcompat/build";
import serve from "@rcompat/http/serve";

const build = new Build({
  name: "app",
  outdir: "public",
  hotreload: { host: "localhost", port: 6262 },
});

build.export('import "./src/index.tsx";');

await build.start();

serve(request => {
  return build.proxy(request, () => {
    return new Response("<html>...</html>", {
      headers: { "content-type": "text/html" },
    });
  });
}, { host: "localhost", port: 3000 });
```

### Production build script

```js
import Build from "@rcompat/build";
import { prod } from "@rcompat/build/modes";

const build = new Build({
  name: "app",
  entryPoints: ["src/index.tsx"],
  outdir: "dist",
  target: "es2020",
}, prod);

await build.start();
console.log("Build complete!");
```

### Transform React component

```js
import transform from "@rcompat/build/transform";
import react from "@rcompat/build/preset/react";

const code = `
export function Button({ children }) {
  return <button className="btn">{children}</button>;
}
`;

const { code: output } = await transform(code, react);
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

