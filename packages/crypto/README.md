# @rcompat/crypto

Cryptographic functions for JavaScript runtimes.

## What is @rcompat/crypto?

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

### Web Crypto API

Access the Web Crypto API directly. On Node, this re-exports `webcrypto` from
`node:crypto`. On Bun and Deno, it's the global `crypto` object.

```js
import crypto from "@rcompat/crypto";

// Generate random values
const randomBytes = new Uint8Array(16);
crypto.getRandomValues(randomBytes);

// Generate a UUID
const uuid = crypto.randomUUID();

// Use SubtleCrypto for more operations
const key = await crypto.subtle.generateKey(
  { name: "AES-GCM", length: 256 },
  true,
  ["encrypt", "decrypt"]
);
```

## API Reference

### `hash(data, algorithm?)`

```ts
declare function hash(
  data: string | ArrayBuffer | ArrayBufferView,
  algorithm?: string
): Promise<string>;
```

Generates a short hash from the input data.

| Parameter   | Type                                      | Default      | Description           |
|-------------|-------------------------------------------|--------------|-----------------------|
| `data`      | `string \| ArrayBuffer \| ArrayBufferView` | —            | Data to hash          |
| `algorithm` | `string`                                  | `"SHA-256"`  | Hash algorithm        |

**Returns**: A promise that resolves to a 21-character hash string.

Supported algorithms (via Web Crypto API):
- `"SHA-1"` (not recommended for security)
- `"SHA-256"` (default)
- `"SHA-384"`
- `"SHA-512"`

### Default Export (Web Crypto)

```ts
declare const crypto: Crypto;
```

The Web Crypto API object with:

| Property/Method      | Description                              |
|----------------------|------------------------------------------|
| `getRandomValues()`  | Fill typed array with random values      |
| `randomUUID()`       | Generate a random UUID                   |
| `subtle`             | SubtleCrypto interface for key operations |

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

### Generate secure random token

```js
import crypto from "@rcompat/crypto";

function generateToken(length = 32) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

const token = generateToken();
// "a1b2c3d4e5f6..."
```

### Encrypt and decrypt data

```js
import crypto from "@rcompat/crypto";

async function encryptData(data, key) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(data);
  
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  );
  
  return { iv, ciphertext };
}

async function decryptData({ iv, ciphertext }, key) {
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext
  );
  
  return new TextDecoder().decode(decrypted);
}
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

