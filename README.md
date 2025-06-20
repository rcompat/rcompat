# rcompat

Standard library for JavaScript runtimes.

## What is rcompat?

A standard library for JavaScript runtimes, consistently working across Node,
Deno, Bun and future runtimes.

## Packages

| Package                                   | Purpose                          |
|-------------------------------------------|----------------------------------|
|[@rcompat/args](packages/args)             | Program arguments                |
|[@rcompat/array](packages/array)           | Array handling                   |
|[@rcompat/assert](packages/assert)         | Invariant assertions             |
|[@rcompat/async](packages/async)           | Async operations                 |
|[@rcompat/bufferview](packages/bufferview) | Buffers                          |
|[@rcompat/build](packages/build)           | Client builder                   |
|[@rcompat/cli](packages/cli)               | CLI tools                        |
|[@rcompat/crypto](packages/crypto)         | Cryptographic functions          |
|[@rcompat/env](packages/env)               | Environment loading              |
|[@rcompat/fs](packages/fs)                 | Filesystem access                |
|[@rcompat/function](packages/function)     | Function handling                |
|[@rcompat/html](packages/html)             | HTML handling                    |
|[@rcompat/http](packages/http)             | HTTP servers                     |
|[@rcompat/package](packages/package)       | Package helpers                  |
|[@rcompat/proby](packages/proby)           | Test runner                      |
|[@rcompat/record](packages/record)         | Record helpers                   |
|[@rcompat/runtime](packages/runtime)       | Runtime detection                |
|[@rcompat/sql](packages/sql)               | SQL abstractions                 |
|[@rcompat/stdio](packages/stdio)           | Input/output                     |
|[@rcompat/stream](packages/stream)         | Stream handling                  |
|[@rcompat/string](packages/string)         | String handling                  |
|[@rcompat/test](packages/test)             | Testing                          |
|[@rcompat/type](packages/type)             | Types                            |
|[@rcompat/webview](packages/webview)       | Webview                          |
|[@rcompat/worker](packages/worker)         | Web workers                      |

## Motivation

### Native speed gains

While tools like Bun strive to be fully compatible with Node's built-in modules
and NPM, with Deno also moving in that direction, those backwards
compatibilities carry a lot of cruft and in the end, you're just using another
runtime to run code written for Node, without taking advantage of the inherent
speed gains that modern APIs introduce. rcompat abstracts that away for you.
You write code once and, wherever possible, it will take advantage of *native*
APIs. This allows you not only to run the same code with different runtimes,
but also speed it up if you choose Bun or Deno over Node during production. You
can easily switch between the runtimes, testing stability vs. modern features,
finding the best runtime for a given app.

### Forward compatibility

rcompat offers forward compatibility in the sense that it can add support for
new runtimes as they emerge *even* on minor updates (as this isn't considered
breaking existing code), allowing you to run old code that was written with
rcompat by newer runtimes. No other server-side interoperability layer for
JavaScript offers this kind of flexibility.

### Batteries included

rcompat is designed with many modules in mind, including `@rcompat/fs` for
filesystem operations, `@rcompat/http` for using a modern HTTP server working
with WHATWG `Request`/`Response` (which Node doesn't support; rcompat wraps
a Node request object into a WHATWG `Request` as it comes in),
`@rcompat/invariant` for ensuring runtime invariants, `@rcompat/record` for
record handling, and many more useful modules and abstractions.

The standard library is designed to accommodate modern development needs: for
example, `@rcompat/http` supports WebSockets (natively on Deno/Bun, and using
NPM's `ws` on Node), while `@rcompat/fs/FileRef` offers globbing, listing and
manipulation of files, similarly to Python's `pathlib`.

For example, to set up a server with rcompat, use `@rcompat/http/serve` -- the
server-side equivalent of `fetch`.

```js
import serve from "@rcompat/http/serve";

serve(request => new Response("Hi!"), { host: "localhost", port: 6161 });
```

This code runs successfully with either `node app.js` (if you set your
package.json to `{ "type": "module" }`; otherwise use `app.mjs`), `deno run
-A app.js` or `bun --bun app.js`, taking advantage of native optimizations.

### Another standard library?

The JavaScript ecosystem is replete with standard libraries. To take the
example of filesystem access, Node has at least three ways of accessing the
filesystem (sync, callbacks, promises), and then there's Deno's own filesystem
APIs, while Bun has its APIs too. Those all have their pros and cons, and if
you want to target all of them, you're going to have to write a lot of
branching code. rcompat is an abstraction over that, as it plays the role of
both a standard library *and* a runtime compatibility layer -- write once,
target everything.

For example, here's how you can read a file and parse it as JSON.

```js
import FileRef from "@rcompat/fs/FileRef";

console.log(await new FileRef("./users.json").json());
```

Again, this code runs successfully on Node, Deno or Bun, taking advantage of
optimizations native to every runtime.

## Evolving standard — input needed

rcompat has been quietly developed the last few months in conjunction with
[Primate](https://primate.run)'s development and is largely influenced by its
needs. We'd like to invite more participation by other projects / individuals
in order to converge on APIs that best serve everyone and are the most useful
on a broad basis.

## Resources

* Discord: https://discord.gg/RSg4NNwM4f

## License

MIT

## Contributing

See [Contributing](CONTRIBUTING.md)
