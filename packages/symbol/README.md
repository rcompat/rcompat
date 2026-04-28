# @rcompat/symbol

Well-known symbols for JavaScript runtimes.

## What is @rcompat/symbol?

A cross-runtime module providing common interoperability symbols. Works
consistently across Node, Deno, and Bun.

## Installation

```bash
npm install @rcompat/symbol
```

```bash
pnpm add @rcompat/symbol
```

```bash
yarn add @rcompat/symbol
```

```bash
bun add @rcompat/symbol
```

## Usage

```js
import symbol from "@rcompat/symbol";

// mark an object as parseable
class RequestBag {
  [symbol.parse]() {
    return this.toJSON();
  }
}

// mark an object as streamable
class FileRef {
  [symbol.stream]() {
    return this.toReadableStream();
  }
}
```

## API Reference

### `symbol.parse`

```ts
import symbol from "@rcompat/symbol";

symbol.parse: unique symbol;
```

Denotes that an object can produce a plain representation of itself by calling
`[symbol.parse]()`. Validation libraries can look for this symbol and use it
instead of requiring a plain object directly.

### `symbol.stream`

```ts
import symbol from "@rcompat/symbol";

symbol.stream: unique symbol;
```

Denotes that an object is streamable via `[symbol.stream]()`.

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
