# @rcompat/webview

Native webview for JavaScript runtimes.

## What is @rcompat/webview?

A cross-runtime module for creating native desktop applications with web
technologies. Uses the system's native webview (WebKit on macOS/Linux,
WebView2 on Windows) for lightweight, fast rendering. Works with Bun and Deno.

> **Note:** Node.js bindings will be added at a later date.

## Installation

```bash
npm install @rcompat/webview
```

```bash
pnpm add @rcompat/webview
```

```bash
yarn add @rcompat/webview
```

```bash
bun add @rcompat/webview
```

## Usage

### Basic webview

```ts
import platform from "@rcompat/webview/default";
import Webview from "@rcompat/webview";

const webview = new Webview({ platform });

webview.navigate("https://example.com");
webview.run();
```

### Set HTML content directly

```ts
import platform from "@rcompat/webview/default";
import Webview from "@rcompat/webview";

const webview = new Webview({ platform });

webview.html = `
  <!DOCTYPE html>
  <html>
    <body>
      <h1>Hello from Webview!</h1>
    </body>
  </html>
`;

webview.run();
```

### Custom window size

```ts
import platform from "@rcompat/webview/default";
import Webview from "@rcompat/webview";

const webview = new Webview({ platform });

webview.size = {
    width: 800,
    height: 600,
    hint: 0, // 0=none, 1=min, 2=max, 3=fixed
};

webview.navigate("https://example.com");
webview.run();
```

### Debug mode

```ts
import platform from "@rcompat/webview/default";
import Webview from "@rcompat/webview";

// enable developer tools
const webview = new Webview({ platform, debug: true });

webview.navigate("https://example.com");
webview.run();
```

### Server with webview in worker

Create a local server and open it in a webview using a worker for non-blocking
operation:

**worker.ts**

```ts
import platform from "@rcompat/webview/default";
import Webview from "@rcompat/webview";

const webview = new Webview({ platform });

webview.navigate("http://localhost:8181");
webview.run();
```

**app.ts**

```ts
import serve from "@rcompat/http/serve";

const headers = { "Content-Type": "text/html" };
const html = `
  <html>
    <body>
      <h1>Desktop App</h1>
      <a href="https://github.com">GitHub</a>
    </body>
  </html>
`;

serve(() => new Response(html, { headers }), { port: 8181 });

// Bun
new Worker("worker.ts");

// Deno
new Worker(new URL("worker.ts", import.meta.url).href, { type: "module" });
```

## API Reference

### `Webview`

```ts
import Webview from "@rcompat/webview";

new Webview(init: Init);
```

#### Constructor Options

| Property   | Type      | Default | Description                |
| ---------- | --------- | ------- | -------------------------- |
| `platform` | `BunFile` | —       | Platform binary (required) |
| `debug`    | `boolean` | `false` | Enable developer tools     |

#### Properties

| Property | Type           | Description               |
| -------- | -------------- | ------------------------- |
| `html`   | `string` (set) | Set HTML content directly |
| `size`   | `Size` (set)   | Set window dimensions     |

#### Size Object

| Property | Type     | Default | Description                   |
| -------- | -------- | ------- | ----------------------------- |
| `width`  | `number` | `1280`  | Window width in pixels        |
| `height` | `number` | `720`   | Window height in pixels       |
| `hint`   | `0-3`    | `0`     | 0=none, 1=min, 2=max, 3=fixed |

#### Methods

| Method          | Description                             |
| --------------- | --------------------------------------- |
| `navigate(url)` | Navigate to a URL                       |
| `run()`         | Start the webview event loop (blocking) |
| `destroy()`     | Terminate and clean up the webview      |

### Platform Exports

```ts
// auto-detect current platform
import platform from "@rcompat/webview/default";

// or specify explicitly
import platform from "@rcompat/webview/darwin-arm64"; // macOS ARM
import platform from "@rcompat/webview/darwin-x64"; // macOS Intel
import platform from "@rcompat/webview/linux-x64"; // Linux x64
import platform from "@rcompat/webview/windows-x64"; // Windows x64
```

## Compiling to Executable

### Bun

```bash
bun build app.ts worker.ts --compile --minify
```

### Deno

```bash
deno compile --no-check --include worker.ts app.ts
```

## Cross-Compilation

Generate platform-specific builds for distribution:

**build.ts**

```ts
import args from "@rcompat/args";
import FileRef from "@rcompat/fs/FileRef";

const p = "--platform=";
const platform =
  args.find(arg => arg.startsWith(p))?.slice(p.length) ?? "default";

await new FileRef(import.meta.dirname).join("worker.ts").write(`
  import platform from "@rcompat/webview/${platform}";
  import Webview from "@rcompat/webview";

  const webview = new Webview({ platform });
  webview.navigate("http://localhost:8181");
  webview.run();
`);
```

### Build for Linux from macOS

```bash
# Bun
bun build.ts --platform=linux-x64
bun build app.ts worker.ts --compile --target=bun-linux-x64 --minify

# Deno
deno -A build.ts --platform=linux-x64
deno compile --no-check --include worker.ts --target=x86_64-unknown-linux-gnu app.ts
```

## Examples

### Desktop app with graceful shutdown

```ts
// app.ts
import serve from "@rcompat/http/serve";

const html = `
  <!DOCTYPE html>
  <html>
    <body>
      <h1>My Desktop App</h1>
      <button onclick="alert('Clicked!')">Click Me</button>
    </body>
  </html>
`;

const server = await serve(
  () => new Response(html, { headers: { "Content-Type": "text/html" } }),
  { port: 8181 }
);

// Bun
const worker = new Worker("worker.ts");

// Deno
const worker = new Worker(new URL("worker.ts", import.meta.url).href, {
    type: "module",
});

// graceful shutdown when webview closes
worker.addEventListener("message", (event) => {
  if (event.data === "destroyed") {
    server.stop();
  }
});
```

### Static HTML app

```ts
import platform from "@rcompat/webview/default";
import Webview from "@rcompat/webview";

const webview = new Webview({ platform, debug: true });

webview.size = { width: 400, height: 300, hint: 3 }; // Fixed size

webview.html = `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        body {
          font-family: system-ui;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
      </style>
    </head>
    <body>
      <h1>Hello, Desktop!</h1>
    </body>
  </html>
`;

webview.run();
```

## Supported Platforms

| Platform | Architecture | Export         |
| -------- | ------------ | -------------- |
| macOS    | ARM64        | `darwin-arm64` |
| macOS    | x64          | `darwin-x64`   |
| Linux    | x64          | `linux-x64`    |
| Windows  | x64          | `windows-x64`  |

## Cross-Runtime Compatibility

| Runtime | Supported |
| ------- | --------- |
| Bun     | ✓         |
| Deno    | ✓         |
| Node.js | Planned   |

## License

MIT

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) in the repository root.
