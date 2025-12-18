# @rcompat/crypto

Cryptographic functions for JavaScript runtimes.

## What is @rcompat/rypto?

A cross-runtime module providing cryptographic utilities including hashing and
access to the Web Crypto API. Works consistently across Node, Deno, and Bun,
using native implementations where available.

## Installation

```bash
npm install @rcompat/crypto
```

```bash
pnpm add @rcompat/crypto
```

```bash
yarn add @rcompat/crypto
```

```bash
bun add @rcompat/crypto
```

## Usage

### hash

Generate a short hash from data. Useful for cache busting, fingerprinting, or
generating unique identifiers.

```js
import hash from "@rcompat/crypto/hash";

// Hash a string
const h1 = await hash("hello world");
console.log(h1);  // "b94d27b9934d3e08a52n"

// Hash with different algorithm
const h2 = await hash("hello world", "SHA-512");

// Hash binary data
const buffer = new TextEncoder().encode("hello world");
const h3 = await hash(buffer);

// Hash an ArrayBuffer
const arrayBuffer = new ArrayBuffer(16);
const h4 = await hash(arrayBuffer);
```

The hash function returns a 21-character string: 20 hex characters followed by
"n" (for "numeric hash").

## API Reference

### `hash(data, algorithm?)`

```ts
import type { TypedArray } from "@rcompat/type";
type Algorithm = "SHA-256" | "SHA-384" | "SHA-512";

declare function hash(
  data: string | ArrayBuffer | TypedArray,
  algorithm?: Algorithm
): Promise<string>;
```

Generates a short hash from the input data.

| Parameter   | Type                                  | Default      | Description           |
|-------------|---------------------------------------|--------------|-----------------------|
| `data`      | `string \| ArrayBuffer \| TypedArray` | —            | Data to hash          |
| `algorithm` | `string`                              | `"SHA-256"`  | Hash algorithm        |

**Returns**: A promise that resolves to a 21-character hash string.

Supported algorithms:
- `"SHA-256"` (default)
- `"SHA-384"`
- `"SHA-512"`

## Examples

### Cache busting for assets

```js
import hash from "@rcompat/crypto/hash";

async function getAssetUrl(content) {
  const fingerprint = await hash(content);
  return `/assets/bundle.${fingerprint}.js`;
}

const url = await getAssetUrl(bundleContents);
// "/assets/bundle.b94d27b9934d3e08a52n.js"
```

### Content-based deduplication

```js
import hash from "@rcompat/crypto/hash";

const seen = new Set();

async function processUnique(content) {
  const contentHash = await hash(content);

  if (seen.has(contentHash)) {
    return null;  // Already processed
  }

  seen.add(contentHash);
  return process(content);
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

