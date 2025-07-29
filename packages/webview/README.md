# webview

Note: this package currently only works in Bun and Deno. Node bindings will be
added at a later date.

## install

`bun install @rcompat/webview`

## start a webview
```ts
import platform from "@rcompat/webview/default";
import Webview from "@rcompat/webview";

const webview = new Webview({ platform });

webview.navigate("https://primate.run");
webview.run();
```
## start a server and a webview in a worker, nonblocking
### worker.ts
```ts
import platform from "@rcompat/webview/default";
import Webview from "@rcompat/webview";

const webview = new Webview({ platform });

webview.navigate("http://localhost:8181");
webview.run();
```

### app.ts
```ts
import serve from "@rcompat/http/serve";

const headers = { "Content-Type": "text/html" };
const html = `
<html><body>
  <a href="https://primate.run">primate</a>
</body></html>
`;

serve(() => new Response(html, { headers }), { port: 8181 });

// bun
new Worker("worker.ts");

// deno
new Worker(new URL("worker.ts", import.meta.url).href, { type: "module" });
```

## compile into executable

`bun build app.ts worker.ts --compile [--minify]`
or
`deno compile --no-check --include worker.ts app.ts`

## cross-compile
### build.ts
```ts
import args from "@rcompat/args";
import FileRef from "@rcompat/fs/FileRef";

const p = "--platform=";
const platform = args.find(arg => arg.startsWith(p))?.slice(p) ?? "default";

await new FileRef(import.meta.dirname).join("worker.ts").write(`
  import platform from "@rcompat/webview/${platform}";
  import Webview from "@rcompat/webview";

  const webview = new Webview({ platform });

  webview.navigate("http://localhost:8181");
  webview.run();
`)
```
### app.ts
```ts
import serve from "@rcompat/http/serve";

const headers = { "Content-Type": "text/html" };
const html = `
<html><body>
  <a href="https://primate.run">primate</a>
</body></html>
`

const server = await serve(() =>
  new Response(html, { headers }), { port: 8181 });

// bun
const worker = new Worker("worker.ts");

// deno
const worker = new Worker(new URL("worker.ts", import.meta.url).href, {
  type: "module"
});

worker.addEventListener("message", event => {
  event.data === "destroyed" && server.stop();
});
```

`bun --platform=linux-x64 build.ts && bun build app.ts worker.ts --compile --target=bun-linux-x64 [--minify]`
or
`deno -A build.ts --platform=linux-x64 && deno compile --no-check --include worker.ts --target=x86_64-unknown-linux-gnu app.ts`
