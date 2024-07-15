# rcompat

JavaScript interoperability and runtime compatibility layer for servers.

## What is rcompat?

A unified interface for Node, Deno and Bun. Similar to jQuery, just for
servers.

## Packages

| Package                                 | Function                          |
|-----------------------------------------|-----------------------------------|
|[@rcompat/args](packages/args)           | program arguments                 |
|[@rcompat/array](packages/array)         | array utilities                   |
|[@rcompat/async](packages/async)         | async utilities                   |
|[@rcompat/build](packages/build)         | build system                      |
|[@rcompat/cli](packages/cli)             | cli apps                          |
|[@rcompat/crypto](packages/crypto)       | cryptographic functions           |
|[@rcompat/env](packages/env)             | loading environment files         |
|[@rcompat/fs](packages/fs)               | filesystem functions              |
|[@rcompat/function](packages/function)   | function utilities                |
|[@rcompat/http](packages/http)           | http servers                      |
|[@rcompat/invariant](packages/invariant) | runtime validation                |
|[@rcompat/math](packages/math)           | mathematical functions            |
|[@rcompat/module](packages/module)       | module loading                    |
|[@rcompat/object](packages/object)       | object utilities                  |
|[@rcompat/stdio](packages/stdio)         | process handling                  |
|[@rcompat/streams](packages/streams)     | stream utilities                  |
|[@rcompat/string](packages/string)       | string utilities                  |
|[@rcompat/sync](packages/sync)           | sync utilities                    |
|[@rcompat/webview](packages/webview)     | native webview library            |

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
`@rcompat/invariant` for ensuring runtime invariants, `@rcompat/object` for
object transformations, and many more useful modules and abstractions.

The standard library is designed to accommodate modern development needs: for
example, `@rcompat/http` supports WebSockets (natively on Deno/Bun, and using
NPM's `ws` on Node), while `@rcompat/fs.File` offers globbing, listing and
manipulation of files, similarly to Python's `pathlib`.

For example, to set up a server with rcompat, use the `serve` export of
`@rcompat/http` -- the server-side equivalent of `fetch`.

```js
import { serve } from "@rcompat/http";

serve(request => new Response("Hi!"), { host: "localhost", port: 6161 });
```

This code runs successfully with either `node app.js` (if you set your
package.json to `{ "type": "module" }`; otherwise use `app.mjs`), `deno run
--allow-all app.js` or `bun --bun app.js`, taking advantage of native
optimizations.

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
import { json } from "@rcompat/fs";

console.log(await json("./users.json"));
```

Again, this code runs successfully on Node, Deno or Bun, taking advantage of
optimizations native to every runtime.

## Evolving standard — input needed

rcompat has been quietly developed the last few months in conjunction with
[Primate](https://primatejs.com)'s development and is largely influenced by its
needs. We'd like to invite more participation by other projects / individuals
in order to converge on APIs that best serve everyone and are the most useful
on a broad basis.

## Resources

* Discord: https://discord.gg/RSg4NNwM4f

## License

MIT

## Contributing

By contributing to rcompat, you agree that your contributions will be licensed
under its MIT license.
