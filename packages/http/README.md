# @rcompat/http

HTTP server utilities for JavaScript runtimes.

## What is @rcompat/http?

A cross-runtime HTTP server module using WHATWG `Request` and `Response` APIs.
Think of it as the server-side equivalent of `fetch`. Supports WebSockets and
SSL. Works consistently across Node, Deno, and Bun.

## Installation

```bash
npm install @rcompat/http
```

```bash
pnpm add @rcompat/http
```

```bash
yarn add @rcompat/http
```

```bash
bun add @rcompat/http
```

## Usage

### Basic server

```js
import serve from "@rcompat/http/serve";

const server = await serve(request => {
  return new Response("Hello, world!");
}, { host: "localhost", port: 3000 });

// stop the server
server.stop();
```

### Routing

```js
import serve from "@rcompat/http/serve";

await serve(request => {
  const { pathname } = new URL(request.url);

  if (pathname === "/") {
    return new Response("Home");
  }

  if (pathname === "/api/users") {
    return Response.json([{ id: 1, name: "John" }]);
  }

  return new Response("Not Found", { status: 404 });
}, { host: "localhost", port: 3000 });
```

### HTTP methods

```js
import serve from "@rcompat/http/serve";

await serve(async request => {
  const { pathname } = new URL(request.url);
  const { method } = request;

  if (pathname === "/api/data") {
    if (method === "GET") {
      return Response.json({ data: "value" });
    }

    if (method === "POST") {
      const body = await request.json();
      return Response.json({ received: body }, { status: 201 });
    }

    return new Response("Method Not Allowed", { status: 405 });
  }

  return new Response("Not Found", { status: 404 });
}, { host: "localhost", port: 3000 });
```

### Status codes

```js
import serve from "@rcompat/http/serve";
import Status from "@rcompat/http/Status";

await serve(request => {
  return new Response("Created", { status: Status.CREATED });
}, { host: "localhost", port: 3000 });

// available status codes
Status.OK;                    // 200
Status.CREATED;               // 201
Status.NO_CONTENT;            // 204
Status.MOVED_PERMANENTLY;     // 301
Status.NOT_MODIFIED;          // 304
Status.BAD_REQUEST;           // 400
Status.UNAUTHORIZED;          // 401
Status.FORBIDDEN;             // 403
Status.NOT_FOUND;             // 404
Status.INTERNAL_SERVER_ERROR; // 500
// ... and many more
```

### WebSockets

```js
import serve from "@rcompat/http/serve";

const server = await serve(request => {
  // check if it's a WebSocket upgrade request
  if (request.headers.get("upgrade") === "websocket") {
    return server.upgrade(request, {
      open(socket) {
        console.log("Client connected");
        socket.send("Welcome!");
      },
      message(socket, message) {
        console.log("Received:", message);
        socket.send(`Echo: ${message}`);
      },
      close(socket) {
        console.log("Client disconnected");
      },
    });
  }

  return new Response("Hello!");
}, { host: "localhost", port: 3000 });
```

### SSL/HTTPS

```js
import serve from "@rcompat/http/serve";
import FileRef from "@rcompat/fs/FileRef";

await serve(request => {
  return new Response("Secure!");
}, {
  host: "localhost",
  port: 443,
  ssl: {
    cert: new FileRef("./certs/cert.pem"),
    key: new FileRef("./certs/key.pem"),
  },
});
```

### MIME types

Get MIME types by extension or use predefined constants.

```js
import MIME from "@rcompat/http/mime";

MIME.resolve("index.html");  // "text/html"
MIME.resolve("app.js");      // "text/javascript"
MIME.resolve("data.json");   // "application/json"
MIME.resolve("image.png");   // "image/png"

// extensions to mime type
import MIME from "@rcompat/http/mime";

console.log(MIME.html);  // "text/html"
console.log(MIME.json);  // "application/json"
console.log(MIME.png);   // "image/png"
```

### Serving static files

```js
import serve from "@rcompat/http/serve";
import FileRef from "@rcompat/fs/FileRef";
import MIME from "@rcompat/http/mime";

const public = new FileRef("./public");

await serve(async request => {
  const { pathname } = new URL(request.url);
  const file = public.join(pathname.slice(1) || "index.html");

  if (await file.exists()) {
    return new Response(file.stream(), {
      headers: { "content-type": MIME.resolve(file.name) },
    });
  }

  return new Response("Not Found", { status: 404 });
}, { host: "localhost", port: 3000 });
```

## API Reference

### `serve(handler, config?)`

```ts
declare function serve(
  handler: (request: Request) => Response | Promise<Response> | null | Promise<null>,
  config?: Conf
): Promise<Server>;
```

Creates an HTTP server.

| Parameter | Type                             | Description              |
|-----------|----------------------------------|--------------------------|
| `handler` | `(request: Request) => Response` | Request handler function |
| `config`  | `Conf`                           | Server configuration     |

**Returns**: A promise that resolves to a `Server` instance.

### Conf

```ts
interface Conf {
  host: string;     // Default: "localhost"
  port: number;     // Default: 6161
  ssl?: {
    cert: FileRef;  // Path to certificate file
    key: FileRef;   // Path to key file
  };
  timeout?: number; // Request timeout in ms
}
```

### Server

```ts
interface Server {
  stop(): void;
  upgrade(request: Request, actions: Actions): null;
}
```

| Method                    | Returns | Description                  |
|---------------------------|---------|------------------------------|
| `stop()`                  | `void`  | Stop the server              |
| `upgrade(request, actions)` | `null`  | Upgrade to WebSocket         |

### Actions (WebSocket)

```ts
interface Actions {
  open?: (socket: WebSocket) => void;
  message?: (socket: WebSocket, message: string | Buffer) => void;
  close?: (socket: WebSocket) => void;
}
```

### Status

HTTP status code constants.

| Category    | Codes                                                       |
|-------------|-------------------------------------------------------------|
| 1xx Info    | `CONTINUE`, `SWITCHING_PROTOCOLS`, `PROCESS`, `EARLY_HINTS` |
| 2xx Success | `OK`, `CREATED`, `ACCEPTED`, `NO_CONTENT`, `PARTIAL_CONTENT` |
| 3xx Redirect| `MOVED_PERMANENTLY`, `FOUND`, `SEE_OTHER`, `NOT_MODIFIED`, `TEMPORARY_REDIRECT`, `PERMANENT_REDIRECT` |
| 4xx Client  | `BAD_REQUEST`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `METHOD_NOT_ALLOWED`, `CONFLICT`, `GONE`, `UNPROCESSABLE_ENTITY`, `TOO_MANY_REQUESTS` |
| 5xx Server  | `INTERNAL_SERVER_ERROR`, `NOT_IMPLEMENTED`, `BAD_GATEWAY`, `SERVICE_UNAVAILABLE`, `GATEWAY_TIMEOUT` |

## Examples

### REST API

```js
import serve from "@rcompat/http/serve";
import Status from "@rcompat/http/Status";

const users = new Map();

await serve(async request => {
  const { pathname } = new URL(request.url);
  const { method } = request;

  // GET /users
  if (method === "GET" && pathname === "/users") {
    return Response.json([...users.values()]);
  }

  // POST /users
  if (method === "POST" && pathname === "/users") {
    const user = await request.json();
    user.id = crypto.randomUUID();
    users.set(user.id, user);
    return Response.json(user, { status: Status.CREATED });
  }

  // GET /users/:id
  const match = pathname.match(/^\/users\/(.+)$/);
  if (method === "GET" && match) {
    const user = users.get(match[1]);
    if (user) return Response.json(user);
    return Response.json({ error: "Not found" }, { status: Status.NOT_FOUND });
  }

  return new Response("Not Found", { status: Status.NOT_FOUND });
}, { host: "localhost", port: 3000 });
```

### Chat server with WebSockets

```js
import serve from "@rcompat/http/serve";

const clients = new Set();

const server = await serve(request => {
  if (request.headers.get("upgrade") === "websocket") {
    return server.upgrade(request, {
      open(socket) {
        clients.add(socket);
        broadcast(`User joined (${clients.size} online)`);
      },
      message(socket, message) {
        broadcast(`User: ${message}`);
      },
      close(socket) {
        clients.delete(socket);
        broadcast(`User left (${clients.size} online)`);
      },
    });
  }

  return new Response("WebSocket server");
}, { host: "localhost", port: 3000 });

function broadcast(message) {
  for (const client of clients) {
    client.send(message);
  }
}
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

