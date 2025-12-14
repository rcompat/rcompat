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

// encode to Base64
const encoded = Base64.encode("Hello, World!");
console.log(encoded); // "SGVsbG8sIFdvcmxkIQ=="

// decode from Base64
const decoded = Base64.decode(encoded);
console.log(decoded); // "Hello, World!"
```

### Convert to camelcase

```js
import string from "@rcompat/string";

// from kebab-case
string.camelcased("hello-world"); // "helloWorld"
string.camelcased("my-component"); // "myComponent"

// from snake_case
string.camelcased("hello_world"); // "helloWorld"
string.camelcased("user_profile"); // "userProfile"

// mixed
string.camelcased("my-user_name"); // "myUserName"
```

### Dedent multi-line strings

```js
import string from "@rcompat/string";

// as a template tag
const sql = string.dedent`
  SELECT *
  FROM users
  WHERE active = true
`;
// "SELECT *\nFROM users\nWHERE active = true"

// with interpolation
const table = "users";
const query = string.dedent`
  SELECT *
  FROM ${table}
  WHERE id = 1
`;
```

### Convert glob to RegExp

```js
import string from "@rcompat/string";

// simple wildcards
const pattern = string.globify("*.js");
pattern.test("app.js"); // true
pattern.test("app.ts"); // false
pattern.test("dir/app.js"); // false

// double wildcard (recursive)
const recursive = string.globify("**/*.js");
recursive.test("app.js"); // true
recursive.test("src/app.js"); // true
recursive.test("src/lib/app.js"); // true

// single character wildcard
const single = string.globify("file?.txt");
single.test("file1.txt"); // true
single.test("fileA.txt"); // true
single.test("file10.txt"); // false
```

### Capitalize first letter

```js
import string from "@rcompat/string";

string.upperfirst("hello"); // "Hello"
string.upperfirst("world"); // "World"
string.upperfirst("javaScript"); // "JavaScript"
```

### Get UTF-8 byte length

```js
import utf8 from "@rcompat/string/utf8";

// ASCII (1 byte per character)
utf8.bytelength("hello"); // 5

// unicode (variable bytes)
utf8.bytelength("héllo"); // 6 (é = 2 bytes)
utf8.bytelength("日本語"); // 9 (3 bytes each)
utf8.bytelength("🎉"); // 4 (emoji = 4 bytes)
```

### Get UTF-8 size

```js
import utf8 from "@rcompat/string/utf8";

utf8.size("hello"); // 5
utf8.size("héllo"); // 6
utf8.size("日本語"); // 9
utf8.size("🎉"); // 4
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
import string from "@rcompat/string";

string.camelcased(string: string): string;
```

Converts kebab-case or snake_case strings to camelCase.

### `dedent`

```ts
import string from "@rcompat/string";

string.dedent(string: string): string;
string.dedent(strings: TemplateStringsArray, ...values: unknown[]): string;
```

Removes common leading whitespace from multi-line strings. Can be used as
a template tag or called directly with a string.

### `globify`

```ts
import string from "@rcompat/string";

string.globify(pattern: string): RegExp;
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
import string from "@rcompat/string";

string.upperfirst(string: string): string;
```

Capitalizes the first character of a string.

### `utf8.bytelength`

```ts
import utf8 from "@rcompat/string/utf8";

utf8.bytelength(string: string): number;
```

Returns the UTF-8 byte length of a string using native `Buffer.byteLength`.

### `utf8.size`

```ts
import utf8 from "@rcompat/string/utf8";

utf8.size(string: string): number;
```

Pure JavaScript implementation to calculate UTF-8 byte size. Useful when
you need a dependency-free solution or for environments without `Buffer`.

## Examples

### Generate component names

```js
import string from "@rcompat/string";

function toComponentName(filename) {
// "my-button.svelte" -> "MyButton"
const name = filename.replace(/\.\w+$/, "");
return string.upperfirst(string.camelcased(name));
}

toComponentName("my-button.svelte"); // "MyButton"
toComponentName("user_profile.vue"); // "UserProfile"
```

### Build SQL queries

```js
import string from "@rcompat/string";

function buildQuery(table, conditions) {
  return string.dedent`
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
import string from "@rcompat/string";

function matchFiles(files, pattern) {
  const regex = string.globify(pattern);
  return files.filter((file) => regex.test(file));
}

const files = ["app.js", "app.ts", "src/utils.js", "src/lib/helper.js"];

matchFiles(files, "*.js"); // ["app.js"]
matchFiles(files, "**/*.js"); // ["app.js", "src/utils.js", "src/lib/helper.js"]
matchFiles(files, "src/**/*.js"); // ["src/utils.js", "src/lib/helper.js"]
```

### Validate content length

```js
import utf8 from "@rcompat/string/utf8";

function validateContent(content, maxBytes = 1024) {
  const bytes = utf8.bytelength(content);
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
