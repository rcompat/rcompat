# @rcompat/string

String utilities for JavaScript runtimes.

## What is @rcompat/string?

A cross-runtime module providing common string operations: Base64 encoding,
case conversion, dedentation, glob pattern matching, and UTF-8 byte length
calculation. Works consistently across Node, Deno, and Bun.

## Installation

```bash
npm install @rcompat/string
```

```bash
pnpm add @rcompat/string
```

```bash
yarn add @rcompat/string
```

```bash
bun add @rcompat/string
```

## Usage

### Base64 encoding/decoding

```js
import Base64 from "@rcompat/string/Base64";

// Encode to Base64
const encoded = Base64.encode("Hello, World!");
console.log(encoded); // "SGVsbG8sIFdvcmxkIQ=="

// Decode from Base64
const decoded = Base64.decode(encoded);
console.log(decoded); // "Hello, World!"
```

### Convert to camelCase

```js
import camelcased from "@rcompat/string/camelcased";

// From kebab-case
camelcased("hello-world"); // "helloWorld"
camelcased("my-component"); // "myComponent"

// From snake_case
camelcased("hello_world"); // "helloWorld"
camelcased("user_profile"); // "userProfile"

// Mixed
camelcased("my-user_name"); // "myUserName"
```

### Dedent multi-line strings

```js
import dedent from "@rcompat/string/dedent";

// As a template tag
const sql = dedent`
  SELECT *
  FROM users
  WHERE active = true
`;
// "SELECT *\nFROM users\nWHERE active = true"

// With interpolation
const table = "users";
const query = dedent`
  SELECT *
  FROM ${table}
  WHERE id = 1
`;
```

### Convert glob to RegExp

```js
import globify from "@rcompat/string/globify";

// Simple wildcards
const pattern = globify("*.js");
pattern.test("app.js"); // true
pattern.test("app.ts"); // false
pattern.test("dir/app.js"); // false

// Double wildcard (recursive)
const recursive = globify("**/*.js");
recursive.test("app.js"); // true
recursive.test("src/app.js"); // true
recursive.test("src/lib/app.js"); // true

// Single character wildcard
const single = globify("file?.txt");
single.test("file1.txt"); // true
single.test("fileA.txt"); // true
single.test("file10.txt"); // false
```

### Capitalize first letter

```js
import upperfirst from "@rcompat/string/upperfirst";

upperfirst("hello"); // "Hello"
upperfirst("world"); // "World"
upperfirst("javaScript"); // "JavaScript"
```

### Get UTF-8 byte length

```js
import utf8ByteLength from "@rcompat/string/utf8-bytelength";

// ASCII (1 byte per character)
utf8ByteLength("hello"); // 5

// Unicode (variable bytes)
utf8ByteLength("héllo"); // 6 (é = 2 bytes)
utf8ByteLength("日本語"); // 9 (3 bytes each)
utf8ByteLength("🎉"); // 4 (emoji = 4 bytes)
```

### Calculate UTF-8 size (pure JS)

```js
import utf8size from "@rcompat/string/utf8size";

// Same results, pure JavaScript implementation
utf8size("hello"); // 5
utf8size("héllo"); // 6
utf8size("日本語"); // 9
utf8size("🎉"); // 4
```

## API Reference

### `Base64`

```ts
import Base64 from "@rcompat/string/Base64";

Base64.encode(decoded: string): string;
Base64.decode(encoded: string): string;
```

Object with methods for Base64 encoding and decoding.

| Method   | Description               |
| -------- | ------------------------- |
| `encode` | Encode a string to Base64 |
| `decode` | Decode a Base64 string    |

### `camelcased`

```ts
import camelcased from "@rcompat/string/camelcased";

camelcased(string: string): string;
```

Converts kebab-case or snake_case strings to camelCase.

### `dedent`

```ts
import dedent from "@rcompat/string/dedent";

dedent(string: string): string;
dedent(strings: TemplateStringsArray, ...values: unknown[]): string;
```

Removes common leading whitespace from multi-line strings. Can be used as
a template tag or called directly with a string.

### `globify`

```ts
import globify from "@rcompat/string/globify";

globify(pattern: string): RegExp;
```

Converts a glob pattern to a `RegExp`.

| Pattern | Matches                      |
| ------- | ---------------------------- |
| `*`     | Any characters except `/`    |
| `**`    | Any characters including `/` |
| `?`     | Any single character         |
| `.`     | Literal dot (auto-escaped)   |

### `upperfirst`

```ts
import upperfirst from "@rcompat/string/upperfirst";

upperfirst(string: string): string;
```

Capitalizes the first character of a string.

### `utf8-bytelength`

```ts
import utf8ByteLength from "@rcompat/string/utf8-bytelength";

utf8ByteLength(string: string): number;
```

Returns the UTF-8 byte length of a string using native `Buffer.byteLength`.

### `utf8size`

```ts
import utf8size from "@rcompat/string/utf8size";

utf8size(string: string): number;
```

Pure JavaScript implementation to calculate UTF-8 byte size. Useful when
you need a dependency-free solution or for environments without `Buffer`.

## Examples

### Generate component names

```js
import camelcased from "@rcompat/string/camelcased";
import upperfirst from "@rcompat/string/upperfirst";

function toComponentName(filename) {
    // "my-button.svelte" -> "MyButton"
    const name = filename.replace(/\.\w+$/, "");
    return upperfirst(camelcased(name));
}

toComponentName("my-button.svelte"); // "MyButton"
toComponentName("user_profile.vue"); // "UserProfile"
```

### Build SQL queries

```js
import dedent from "@rcompat/string/dedent";

function buildQuery(table, conditions) {
    return dedent`
    SELECT *
    FROM ${table}
    WHERE ${conditions.join(" AND ")}
    ORDER BY created_at DESC
  `;
}

const query = buildQuery("users", ["active = true", "role = 'admin'"]);
```

### File matching

```js
import globify from "@rcompat/string/globify";

function matchFiles(files, pattern) {
    const regex = globify(pattern);
    return files.filter((file) => regex.test(file));
}

const files = ["app.js", "app.ts", "src/utils.js", "src/lib/helper.js"];

matchFiles(files, "*.js"); // ["app.js"]
matchFiles(files, "**/*.js"); // ["app.js", "src/utils.js", "src/lib/helper.js"]
matchFiles(files, "src/**/*.js"); // ["src/utils.js", "src/lib/helper.js"]
```

### Validate content length

```js
import utf8ByteLength from "@rcompat/string/utf8-bytelength";

function validateContent(content, maxBytes = 1024) {
    const bytes = utf8ByteLength(content);
    if (bytes > maxBytes) {
        throw new Error(`Content exceeds ${maxBytes} bytes (got ${bytes})`);
    }
    return content;
}

validateContent("Hello"); // OK
validateContent("日本語".repeat(500)); // Error: exceeds limit
```

### Encode data for URL

```js
import Base64 from "@rcompat/string/Base64";

function encodeState(state) {
    const json = JSON.stringify(state);
    return Base64.encode(json);
}

function decodeState(encoded) {
    const json = Base64.decode(encoded);
    return JSON.parse(json);
}

const state = { page: 1, filter: "active" };
const encoded = encodeState(state); // "eyJwYWdlIjoxLCJmaWx0ZXIiOiJhY3RpdmUifQ=="
const decoded = decodeState(encoded); // { page: 1, filter: "active" }
```

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
